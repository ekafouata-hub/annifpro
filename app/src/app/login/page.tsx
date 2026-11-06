import { Suspense } from "react";
import LoginForm from "@/components/login-form";
import ThemeToggle from "@/components/theme-toggle";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-[28px] border border-sky-400/20 bg-slate-900/90 p-8 shadow-2xl shadow-sky-950/30">
        <div className="mb-5 flex justify-end">
          <ThemeToggle />
        </div>
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-300 text-xl font-extrabold text-slate-950">
            A
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-sky-300/80">
              Association
            </p>
            <h1 className="text-lg font-bold text-white">ISAAC ET REBECCA</h1>
          </div>
        </div>

        <h2 className="text-3xl font-black tracking-tight text-white">
          Connexion
        </h2>
        <p className="mb-7 mt-2 text-sm leading-6 text-slate-300">
          Connectez-vous pour gérer les anniversaires, les rappels et les vœux.
        </p>
        <Suspense fallback={<p className="text-sm text-slate-400">Chargement...</p>}>
          <LoginForm />
        </Suspense>
      </section>
    </main>
  );
}
