import { ConnectingState } from "@/modules/github/components/ConnectingState";

type GithubOAuthCallbackSearchParams = Promise<{
  code?: string | string[];
  state?: string | string[];
}>;

function getSingleSearchParamValue(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

export default async function GithubOAuthCallbackPage({
  searchParams,
}: {
  searchParams: GithubOAuthCallbackSearchParams;
}) {
  const params = await searchParams;
  const code = getSingleSearchParamValue(params.code);
  const state = getSingleSearchParamValue(params.state);

  return <ConnectingState installationId={null} code={code} state={state} />;
}
