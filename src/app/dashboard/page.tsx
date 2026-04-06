import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { routes } from "@/config/routes";
import { AUTH_TOKEN_COOKIE_NAME } from "@/modules/auth/utils";

export default async function DashboardPage() {
  const authToken = (await cookies()).get(AUTH_TOKEN_COOKIE_NAME)?.value;

  if (!authToken) {
    redirect(routes.public.login);
  }

  return (
    <main className="min-h-screen bg-[#0A0F1C] px-6 py-10 text-slate-100">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-100">
          Google sign-in completed successfully.
        </div>

        <section className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.85)] backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Dashboard</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-50">
            You are signed in to CodeSense.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
            Your backend-issued JWT is stored in a secure HttpOnly cookie, and this route now
            requires that cookie before rendering.
          </p>
        </section>
      </div>
    </main>
  );
}
