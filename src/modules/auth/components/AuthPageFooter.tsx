export function AuthPageFooter() {
  return (
    <footer className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1 text-center text-slate-400 sm:text-left">
        <p className="font-semibold text-slate-200">The Digital Architect</p>
        <p>© 2024 THE DIGITAL ARCHITECT. PRECISION FOR THE HIGH-COGNITION DEVELOPER.</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 text-slate-500">
        <a href="#" className="transition hover:text-white">
          Privacy Policy
        </a>
        <a href="#" className="transition hover:text-white">
          Security
        </a>
        <a href="#" className="transition hover:text-white">
          Contact
        </a>
      </div>
    </footer>
  );
}
