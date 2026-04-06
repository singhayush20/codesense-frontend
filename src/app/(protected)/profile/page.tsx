import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default function ProfilePage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <section className="rounded-[2rem] border border-white/10 bg-slate-950/75 p-8 shadow-[0_24px_90px_-56px_rgba(15,23,42,0.95)] backdrop-blur-xl">
        <Badge>Profile</Badge>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-50">
          Placeholder profile route
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
          This page exists to demonstrate protected-route persistence. If the header and sidebar stay in place while navigating here, the shared authenticated layout is working as intended.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Identity</p>
          <h2 className="mt-4 text-2xl font-semibold text-slate-50">Workspace User</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            Replace this placeholder with the real profile data once the authenticated API surface is ready.
          </p>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Session</p>
          <h2 className="mt-4 text-2xl font-semibold text-slate-50">Protected by guard</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            This route is wrapped by the protected layout and redirects to login when the auth cookie is missing.
          </p>
        </Card>
      </div>
    </div>
  );
}
