import { ConnectingState } from "@/modules/github/components/ConnectingState";

type GithubCallbackSearchParams = Promise<{
  installation_id?: string | string[];
}>;

function getSingleSearchParamValue(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

export default async function GithubCallbackPage({
  searchParams,
}: {
  searchParams: GithubCallbackSearchParams;
}) {
  const params = await searchParams;
  const installationId = getSingleSearchParamValue(params.installation_id);

  return <ConnectingState installationId={installationId} code={null} state={null} />;
}
