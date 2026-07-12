# Graph Report - .  (2026-05-14)

## Corpus Check
- Corpus is ~18,417 words - fits in a single context window. You may not need a graph.

## Summary
- 325 nodes · 265 edges · 48 communities detected
- Extraction: 86% EXTRACTED · 14% INFERRED · 0% AMBIGUOUS · INFERRED: 36 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_App Shell & Auth Components|App Shell & Auth Components]]
- [[_COMMUNITY_Routing & Environment Utils|Routing & Environment Utils]]
- [[_COMMUNITY_React Hooks (Auth, GitHub, LLM)|React Hooks (Auth, GitHub, LLM)]]
- [[_COMMUNITY_Google Auth & Layout Logic|Google Auth & Layout Logic]]
- [[_COMMUNITY_Backend Proxy API|Backend Proxy API]]
- [[_COMMUNITY_LLM Configuration Management|LLM Configuration Management]]
- [[_COMMUNITY_GitHub Persistence & Storage|GitHub Persistence & Storage]]
- [[_COMMUNITY_Theme Management Logic|Theme Management Logic]]
- [[_COMMUNITY_Core UI & Utility Components|Core UI & Utility Components]]
- [[_COMMUNITY_Landing Page & Branding|Landing Page & Branding]]
- [[_COMMUNITY_API Communication & Refresh|API Communication & Refresh]]
- [[_COMMUNITY_Protected Pages & Dashboard|Protected Pages & Dashboard]]
- [[_COMMUNITY_GitHub Callback Routing|GitHub Callback Routing]]
- [[_COMMUNITY_Sidebar State & Layout Shell|Sidebar State & Layout Shell]]
- [[_COMMUNITY_GitHub API Client Implementation|GitHub API Client Implementation]]
- [[_COMMUNITY_LLM API Client Implementation|LLM API Client Implementation]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 89|Community 89]]
- [[_COMMUNITY_Community 90|Community 90]]
- [[_COMMUNITY_Community 91|Community 91]]
- [[_COMMUNITY_Community 92|Community 92]]
- [[_COMMUNITY_Community 93|Community 93]]
- [[_COMMUNITY_Community 94|Community 94]]
- [[_COMMUNITY_Community 95|Community 95]]
- [[_COMMUNITY_Community 96|Community 96]]
- [[_COMMUNITY_Community 97|Community 97]]
- [[_COMMUNITY_Community 98|Community 98]]
- [[_COMMUNITY_Community 99|Community 99]]
- [[_COMMUNITY_Community 100|Community 100]]
- [[_COMMUNITY_Community 101|Community 101]]
- [[_COMMUNITY_Community 102|Community 102]]
- [[_COMMUNITY_Community 103|Community 103]]
- [[_COMMUNITY_Community 104|Community 104]]
- [[_COMMUNITY_Community 105|Community 105]]
- [[_COMMUNITY_Community 106|Community 106]]
- [[_COMMUNITY_Community 107|Community 107]]
- [[_COMMUNITY_Community 108|Community 108]]
- [[_COMMUNITY_Community 109|Community 109]]
- [[_COMMUNITY_Community 110|Community 110]]
- [[_COMMUNITY_Community 111|Community 111]]
- [[_COMMUNITY_Community 112|Community 112]]
- [[_COMMUNITY_Community 113|Community 113]]
- [[_COMMUNITY_Community 114|Community 114]]
- [[_COMMUNITY_Community 115|Community 115]]
- [[_COMMUNITY_Community 116|Community 116]]

## God Nodes (most connected - your core abstractions)
1. `handleBackendProxy()` - 13 edges
2. `Utility Functions` - 9 edges
3. `getAuthEnv()` - 8 edges
4. `useAuth()` - 6 edges
5. `appendSetCookieHeaders()` - 6 edges
6. `useGithub` - 6 edges
7. `readJson()` - 5 edges
8. `writeJson()` - 5 edges
9. `LoginPageRoute()` - 4 edges
10. `getSingleSearchParamValue()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `HomePage()` --calls--> `useAuth()`  [INFERRED]
  src\app\(public)\page.tsx → src\modules\auth\hooks\useAuth.ts
- `handleBackendProxy()` --calls--> `getAuthEnv()`  [INFERRED]
  src\app\api\backend\[...backendPath]\route.ts → src\config\env.ts
- `handleBackendProxy()` --calls--> `getBackendAuthCookieHeader()`  [INFERRED]
  src\app\api\backend\[...backendPath]\route.ts → src\modules\auth\server\session.ts
- `handleBackendProxy()` --calls--> `appendSetCookieHeaders()`  [INFERRED]
  src\app\api\backend\[...backendPath]\route.ts → src\modules\auth\server\session.ts
- `GET()` --calls--> `getAuthEnv()`  [INFERRED]
  src\app\auth\google\start\route.ts → src\config\env.ts

## Hyperedges (group relationships)
- **Landing Module UI Components** — metrics_metrics, personas_personas, workflow_workflow, navbar_navbar [EXTRACTED 1.00]
- **Theme Management System** — themetoggle_themetoggle, themeprovider_themeprovider [INFERRED 0.95]

## Communities

### Community 0 - "App Shell & Auth Components"
Cohesion: 0.08
Nodes (24): Dashboard Header Component, Protected Layout Shell, Dashboard Sidebar Component, Auth Events, LoginCard Component, LoginPage Component, Auth Logout API Route, OAuthButton Component (+16 more)

### Community 1 - "Routing & Environment Utils"
Cohesion: 0.18
Nodes (16): GET(), redirectToLogin(), getAuthEnv(), getRequiredEnv(), getRequiredUrlEnv(), POST(), buildRefreshFailureResponse(), POST() (+8 more)

### Community 2 - "React Hooks (Auth, GitHub, LLM)"
Cohesion: 0.11
Nodes (9): ConnectGithubCard(), useAuth(), useGithub(), useLLM(), LoginPage(), AuthProvider(), useAuthContext(), HomePage() (+1 more)

### Community 3 - "Google Auth & Layout Logic"
Cohesion: 0.15
Nodes (10): RootLayout(), buildGoogleAuthorizationUrl(), buildGoogleRedirectUri(), getAuthNoticeMessage(), getOAuthErrorMessage(), getSingleSearchParamValue(), isAuthenticatedValue(), LoginPageRoute() (+2 more)

### Community 4 - "Backend Proxy API"
Cohesion: 0.35
Nodes (10): DELETE(), GET(), getForwardHeaders(), getForwardResponseHeaders(), handleBackendProxy(), HEAD(), OPTIONS(), PATCH() (+2 more)

### Community 5 - "LLM Configuration Management"
Cohesion: 0.22
Nodes (2): handleSave(), validateForm()

### Community 6 - "GitHub Persistence & Storage"
Cohesion: 0.38
Nodes (9): canUseStorage(), getStoredGithubAccounts(), getStoredGithubRepositories(), getStoredSelectedRepoIds(), readJson(), storeGithubAccounts(), storeGithubRepositories(), storeSelectedRepoIds() (+1 more)

### Community 7 - "Theme Management Logic"
Cohesion: 0.27
Nodes (3): getInitialThemePreference(), isThemePreference(), readStoredThemePreference()

### Community 8 - "Core UI & Utility Components"
Cohesion: 0.2
Nodes (10): Utility Functions, Badge UI Component, Button UI Component, Card UI Component, Checkbox UI Component, Container UI Component, IconBox UI Component, Input UI Component (+2 more)

### Community 9 - "Landing Page & Branding"
Cohesion: 0.31
Nodes (9): CodeSense Platform, LandingPage Page, Metrics Component, Navbar Component, NavbarClient Component, Personas Component, ThemeProvider Provider, ThemeToggle Component (+1 more)

### Community 10 - "API Communication & Refresh"
Cohesion: 0.39
Nodes (6): dispatchAuthSessionExpired(), apiFetch(), issueBackendRequest(), normalizeBackendPath(), performRefresh(), refreshSession()

### Community 11 - "Protected Pages & Dashboard"
Cohesion: 0.29
Nodes (7): DashboardPage, RepositoriesPage, RepositoryConfigPage, SettingsPage, GitHub Persistence Store, GitHub Module Types, useGithub

### Community 13 - "GitHub Callback Routing"
Cohesion: 0.6
Nodes (3): getSingleSearchParamValue(), GithubCallbackPage(), GithubOAuthCallbackPage()

### Community 14 - "Sidebar State & Layout Shell"
Cohesion: 0.6
Nodes (3): getDesktopSidebarState(), handleChange(), syncSidebarState()

### Community 17 - "GitHub API Client Implementation"
Cohesion: 0.5
Nodes (1): GithubApiError

### Community 19 - "LLM API Client Implementation"
Cohesion: 0.5
Nodes (1): LLMApiError

### Community 52 - "Community 52"
Cohesion: 1.0
Nodes (2): Providers, RootLayout

### Community 86 - "Community 86"
Cohesion: 1.0
Nodes (1): AuthLayout

### Community 87 - "Community 87"
Cohesion: 1.0
Nodes (1): LoginPageRoute

### Community 88 - "Community 88"
Cohesion: 1.0
Nodes (1): ProtectedLayout

### Community 89 - "Community 89"
Cohesion: 1.0
Nodes (1): HomePage

### Community 90 - "Community 90"
Cohesion: 1.0
Nodes (1): BackendProxyRoute

### Community 91 - "Community 91"
Cohesion: 1.0
Nodes (1): GoogleCallbackRoute

### Community 92 - "Community 92"
Cohesion: 1.0
Nodes (1): GoogleStartRoute

### Community 93 - "Community 93"
Cohesion: 1.0
Nodes (1): Middleware Proxy

### Community 94 - "Community 94"
Cohesion: 1.0
Nodes (1): Environment Configuration

### Community 95 - "Community 95"
Cohesion: 1.0
Nodes (1): Site Configuration

### Community 96 - "Community 96"
Cohesion: 1.0
Nodes (1): Application Constants

### Community 97 - "Community 97"
Cohesion: 1.0
Nodes (1): Zod Validation Schemas

### Community 98 - "Community 98"
Cohesion: 1.0
Nodes (1): Auth Types

### Community 99 - "Community 99"
Cohesion: 1.0
Nodes (1): AuthPageFooter Component

### Community 100 - "Community 100"
Cohesion: 1.0
Nodes (1): GitHub API Client

### Community 101 - "Community 101"
Cohesion: 1.0
Nodes (1): ConnectGithubCard Component

### Community 102 - "Community 102"
Cohesion: 1.0
Nodes (1): ConnectingState Component

### Community 103 - "Community 103"
Cohesion: 1.0
Nodes (1): RepoSelectionTable Component

### Community 104 - "Community 104"
Cohesion: 1.0
Nodes (1): Cta Component

### Community 105 - "Community 105"
Cohesion: 1.0
Nodes (1): Features Component

### Community 106 - "Community 106"
Cohesion: 1.0
Nodes (1): Footer Component

### Community 107 - "Community 107"
Cohesion: 1.0
Nodes (1): Hero Component

### Community 108 - "Community 108"
Cohesion: 1.0
Nodes (1): Metrics Component

### Community 109 - "Community 109"
Cohesion: 1.0
Nodes (1): Personas Component

### Community 110 - "Community 110"
Cohesion: 1.0
Nodes (1): Workflow Component

### Community 111 - "Community 111"
Cohesion: 1.0
Nodes (1): LLM API Configuration

### Community 112 - "Community 112"
Cohesion: 1.0
Nodes (1): Theme Utilities

### Community 113 - "Community 113"
Cohesion: 1.0
Nodes (1): useTheme Hook

### Community 114 - "Community 114"
Cohesion: 1.0
Nodes (1): Global App Store

### Community 115 - "Community 115"
Cohesion: 1.0
Nodes (1): Global Types

### Community 116 - "Community 116"
Cohesion: 1.0
Nodes (1): Repository Configuration Documentation

## Knowledge Gaps
- **59 isolated node(s):** `Personas Component`, `RootLayout`, `Providers`, `AuthLayout`, `LoginPageRoute` (+54 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `LLM Configuration Management`** (10 nodes): `formatProviderType()`, `handleCancel()`, `handleChangeClick()`, `handleDelete()`, `handleModelNameChange()`, `handleSave()`, `loadConfig()`, `loadProviders()`, `validateForm()`, `RepositoryConfig.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `GitHub API Client Implementation`** (4 nodes): `GithubApiError`, `.constructor()`, `parseJsonResponse()`, `github.api.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `LLM API Client Implementation`** (4 nodes): `LLMApiError`, `.constructor()`, `parseJsonResponse()`, `llm.api.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 52`** (2 nodes): `Providers`, `RootLayout`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 86`** (1 nodes): `AuthLayout`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 87`** (1 nodes): `LoginPageRoute`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 88`** (1 nodes): `ProtectedLayout`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 89`** (1 nodes): `HomePage`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 90`** (1 nodes): `BackendProxyRoute`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 91`** (1 nodes): `GoogleCallbackRoute`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 92`** (1 nodes): `GoogleStartRoute`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 93`** (1 nodes): `Middleware Proxy`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 94`** (1 nodes): `Environment Configuration`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 95`** (1 nodes): `Site Configuration`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 96`** (1 nodes): `Application Constants`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 97`** (1 nodes): `Zod Validation Schemas`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 98`** (1 nodes): `Auth Types`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 99`** (1 nodes): `AuthPageFooter Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 100`** (1 nodes): `GitHub API Client`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 101`** (1 nodes): `ConnectGithubCard Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 102`** (1 nodes): `ConnectingState Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 103`** (1 nodes): `RepoSelectionTable Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 104`** (1 nodes): `Cta Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 105`** (1 nodes): `Features Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 106`** (1 nodes): `Footer Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 107`** (1 nodes): `Hero Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 108`** (1 nodes): `Metrics Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 109`** (1 nodes): `Personas Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 110`** (1 nodes): `Workflow Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 111`** (1 nodes): `LLM API Configuration`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 112`** (1 nodes): `Theme Utilities`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 113`** (1 nodes): `useTheme Hook`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 114`** (1 nodes): `Global App Store`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 115`** (1 nodes): `Global Types`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 116`** (1 nodes): `Repository Configuration Documentation`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getAuthEnv()` connect `Routing & Environment Utils` to `Google Auth & Layout Logic`, `Backend Proxy API`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `GET()` connect `Google Auth & Layout Logic` to `Routing & Environment Utils`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `handleBackendProxy()` (e.g. with `getAuthEnv()` and `getBackendAuthCookieHeader()`) actually correct?**
  _`handleBackendProxy()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `getAuthEnv()` (e.g. with `handleBackendProxy()` and `GET()`) actually correct?**
  _`getAuthEnv()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `useAuth()` (e.g. with `HomePage()` and `useAuthContext()`) actually correct?**
  _`useAuth()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `appendSetCookieHeaders()` (e.g. with `handleBackendProxy()` and `GET()`) actually correct?**
  _`appendSetCookieHeaders()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Personas Component`, `RootLayout`, `Providers` to the rest of the system?**
  _59 weakly-connected nodes found - possible documentation gaps or missing edges._