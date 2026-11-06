import Link from "next/link";
import { redirect } from "next/navigation";
import { updateProfile } from "@/app/actions/profile";
import { getCurrentProfile } from "@/lib/supabase/server";
import ThemeToggle from "@/components/theme-toggle";

export default async function ProfilePage() {
  const profileResult = await getCurrentProfile();

  if (!profileResult?.user || !profileResult.profile) {
    redirect("/login");
  }

  const { user, profile } = profileResult;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6 flex items-center justify-between rounded-[24px] border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/30">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-sky-300/80">
              Profil utilisateur
            </p>
            <h1 className="mt-2 text-2xl font-black text-white">Mon compte</h1>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/"
              className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-white transition hover:border-sky-400 hover:text-sky-300"
            >
              Tableau de bord
            </Link>
          </div>
        </header>

        <section className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/25">
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-sky-400/20 bg-sky-500/5 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-sky-300/80">Compte</p>
              <p className="mt-2 text-lg font-semibold text-white">{profile.full_name || "Utilisateur"}</p>
            </div>
            <span className="rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1 text-sm text-sky-200">
              {profile.role === "super_admin" ? "Super administrateur" : "Responsable du bureau"}
            </span>
          </div>

          <form action={updateProfile} className="space-y-5">
            <div>
              <label htmlFor="full_name" className="mb-2 block text-sm text-slate-300">
                Nom complet
              </label>
              <input
                id="full_name"
                name="full_name"
                defaultValue={profile.full_name || ""}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-sky-400"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm text-slate-300">
                Adresse e-mail
              </label>
              <input
                id="email"
                value={user.email || ""}
                readOnly
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-300 outline-none"
              />
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3">
              <p className="text-sm text-slate-400">Rôle du compte</p>
              <p className="mt-1 font-medium text-white">
                {profile.role === "super_admin" ? "Super administrateur" : "Responsable du bureau"}
              </p>
            </div>

            <button
              type="submit"
              className="rounded-xl bg-sky-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
            >
              Enregistrer les modifications
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
