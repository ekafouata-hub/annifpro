import Link from "next/link";
import LogoutButton from "@/components/logout-button";
import {
  dashboardTemplates,
  mockMembers,
  reminderHighlights,
} from "@/lib/mock-data";
import { getCurrentProfile } from "@/lib/supabase/server";

const stats = [
  {
    label: "Aujourd'hui",
    value: String(mockMembers.filter((member) => member.birth_date || member.marriage_date).length),
    detail: "anniversaires suivis",
  },
  { label: "Demain", value: "02", detail: "rappels à préparer" },
  { label: "Cette semaine", value: "06", detail: "personnes concernées" },
];

export default async function Home() {
  const profileResult = await getCurrentProfile();
  const profile = profileResult?.profile;
  const user = profileResult?.user;
  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Utilisateur";
  const roleLabel =
    profile?.role === "super_admin" ? "Super administrateur" : "Responsable du bureau";

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 rounded-[28px] border border-sky-400/20 bg-slate-900/80 px-5 py-4 shadow-2xl shadow-sky-950/30 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-300 text-xl font-extrabold text-slate-950">
              A
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-sky-300/80">
                Association
              </p>
              <h2 className="text-xl font-bold text-white">ISAAC ET REBECCA</h2>
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 text-sm text-slate-300 sm:flex-row sm:items-center">
            <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-amber-200">
              {profile ? `${displayName} • ${roleLabel}` : "Données de démonstration"}
            </span>
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-white transition hover:border-sky-400 hover:text-sky-300"
              >
                Profil
              </Link>
              <Link
                href="/members"
                className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-white transition hover:border-sky-400 hover:text-sky-300"
              >
                Membres
              </Link>
              <LogoutButton />
            </div>
          </div>
        </header>

        {profile && user ? (
          <section className="mb-6 rounded-[28px] border border-sky-400/20 bg-slate-900/80 p-5 shadow-xl shadow-sky-950/20">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-sky-300/80">
                  Session active
                </p>
                <h3 className="mt-2 text-2xl font-bold text-white">Bienvenue, {displayName}</h3>
              </div>

              <div className="flex flex-col text-sm text-slate-300 md:items-end">
                <span>{user.email}</span>
                <span className="mt-1 rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1 text-sky-200">
                  {roleLabel}
                </span>
              </div>
            </div>
          </section>
        ) : null}

        <section className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-[24px] border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/20"
              >
                <p className="text-sm text-slate-400">{item.label}</p>
                <div className="mt-4 flex items-end justify-between gap-2">
                  <span className="text-3xl font-black text-white">{item.value}</span>
                  <span className="rounded-full border border-sky-400/20 bg-sky-500/10 px-2 py-1 text-xs text-sky-300">
                    {item.detail}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/25">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-sky-300/80">
                  Rappels à venir
                </p>
                <h3 className="mt-2 text-2xl font-bold text-white">Anniversaires</h3>
              </div>
              <Link
                href="/members"
                className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-white transition hover:border-sky-400 hover:text-sky-300"
              >
                Voir le calendrier
              </Link>
            </div>

            <div className="space-y-4">
              {reminderHighlights.map((item) => (
                <div
                  key={item.name}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-full bg-sky-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-300">
                        {item.type}
                      </span>
                      <span className="text-xs text-slate-400">{item.stage}</span>
                    </div>
                    <h4 className="text-lg font-semibold text-white">{item.name}</h4>
                    <p className="mt-1 text-sm text-slate-400">{item.date}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                      {item.status}
                    </span>
                    <button className="rounded-lg bg-sky-400 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-300">
                      Ouvrir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/25">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-sky-300/80">
                  Modèles
                </p>
                <h3 className="mt-2 text-2xl font-bold text-white">Messages & affiches</h3>
              </div>
              <button className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-white transition hover:border-sky-400 hover:text-sky-300">
                Nouveau modèle
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {dashboardTemplates.map((template) => (
                <div
                  key={template.name}
                  className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
                >
                  <div
                    className={`mb-4 h-24 rounded-xl bg-gradient-to-br ${
                      template.tone === "sky"
                        ? "from-sky-400 via-cyan-300 to-blue-500"
                        : template.tone === "violet"
                          ? "from-violet-500 via-purple-400 to-pink-500"
                          : "from-amber-400 via-orange-300 to-rose-500"
                    }`}
                  />
                  <h4 className="text-base font-semibold text-white">{template.name}</h4>
                  <p className="mt-2 text-sm text-slate-400">
                    Prêt à distribuer sur WhatsApp et en e-mail.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
