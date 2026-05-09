# Repository Configuration Screen

A comprehensive repository configuration interface for managing LLM settings and repository metadata in CodeSense.

## Features

- **Repository Header**: Displays repository name with PUBLIC/PRIVATE status badge
  - Green badge for public repositories
  - Red badge for private repositories
  - Full repository path shown below the name

- **Tab Navigation**: Three tabs for different sections
  - **Overview**: Repository overview (empty for now, ready for future implementation)
  - **Pull Requests**: PR management (empty for now, ready for future implementation)
  - **Settings**: LLM configuration and repository settings

- **LLM Configuration Section**:
  - Provider dropdown selector with options:
    - OpenAI
    - Anthropic
    - Gemini
    - Bedrock
    - Ollama
    - Nvidia
  - Model name input field with validation
    - Required field validation
    - Real-time error clearing
    - Descriptive placeholder examples

- **Form Actions**:
  - Save button (enabled only in Settings tab)
  - Cancel button
  - Loading state feedback

## Component Props

```typescript
interface RepositoryConfigProps {
  repository: GithubRepository;
  onSave?: (provider: ProviderType, modelName: string) => Promise<void>;
  onCancel?: () => void;
}
```

### Props Details

- **repository** (required)
  - Type: `GithubRepository`
  - The repository object containing id, name, fullName, isPrivate, and permissions

- **onSave** (optional)
  - Type: `(provider: ProviderType, modelName: string) => Promise<void>`
  - Callback function called when Save button is clicked
  - Receives the selected LLM provider and model name
  - Should handle API call to persist configuration

- **onCancel** (optional)
  - Type: `() => void`
  - Callback function called when Cancel button is clicked
  - Used to navigate away from the configuration screen

## Usage Example

```typescript
import { RepositoryConfig } from "@/modules/github/components";
import { useGithub } from "@/modules/github/hooks/useGithub";
import { ProviderType } from "@/modules/llm/types/llm.types";

export default function RepositoryPage() {
  const { repositories } = useGithub();
  const selectedRepo = repositories[0];

  const handleSave = async (provider: ProviderType, modelName: string) => {
    // Call your API to save the configuration
    await saveLLMConfig(selectedRepo.id, { provider, modelName });
  };

  const handleCancel = () => {
    // Navigate back
    router.back();
  };

  return (
    <RepositoryConfig
      repository={selectedRepo}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
```

## Validation Rules

### Model Name Field
- **Required**: Field must not be empty
- **Trigger**: Form submission (Save button click)
- **Error Display**: Red error message below the input
- **Error Clearing**: Automatically clears when user starts typing

## Styling

The component uses the design system established in CodeSense:
- Tailwind CSS for layout and responsive design
- CSS variables for theming (`--color-*`, `--shadow-*`)
- Dark mode support built-in
- Consistent hover effects and transitions
- Responsive layout that adapts to screen size

## Accessibility

- Semantic HTML structure with proper heading hierarchy
- Form labels properly associated with inputs
- ARIA attributes for form validation (`aria-invalid`)
- Keyboard navigation support
- Error messages linked to form fields
- Proper button states and disabled states

## Route Integration

The component is integrated at:
```
/repositories/[repoId]/page.tsx
```

Access by navigating to:
```
/repositories/{repositoryId}
```

Example:
```
/repositories/gh-repo-123
```

## Future Enhancements

The following sections are structured for future implementation:
1. **Overview Tab**: Repository statistics, recent commits, collaborators
2. **Pull Requests Tab**: List of open, merged, and closed pull requests
3. **Settings Tab** (additional options):
   - Additional LLM provider configurations
   - Repository-specific review rules
   - Notification preferences
   - Access control settings

## State Management

The component manages:
- Active tab selection
- LLM provider selection
- Model name input value
- Form validation errors
- Loading state during API calls

All state is local to the component. For global state management needs, integrate with your Redux/Zustand store as needed.
