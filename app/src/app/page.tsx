import Link from "next/link";
import LogoutButton from "@/components/logout-button";
import ThemeToggle from "@/components/theme-toggle";
import type { MessageTemplate } from "@/lib/database-types";
import type { Member } from "@/lib/mock-data";
import { createClient, getCurrentProfile } from "@/lib/supabase/server";

type UpcomingOccasion = {
  id: string;
  memberId: string;
  memberName: string;
  type: "Naissance" | "Mariage";
  nextDate: Date;
  daysUntil: number;
};

function getUpcomingOccasions(members: Member[], now = new Date()) {
  const todayUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const occasions: UpcomingOccasion[] = [];

  for (const member of members) {
    for (const [type, dateValue] of [
      ["Naissance", member.birth_date],
      ["Mariage", member.marriage_date],
    ] as const) {
      if (!dateValue) continue;

      const [, month, day] = dateValue.split("-").map(Number);
      if (!month || !day) continue;

      let nextDate = new Date(now.getFullYear(), month - 1, day);
      if (nextDate.getTime() < new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) {
        nextDate = new Date(now.getFullYear() + 1, month - 1, day);
      }

      const nextDateUtc = Date.UTC(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate());
      occasions.push({
        id: `${member.id}-${type}`,
        memberId: member.id,
        memberName: member.full_name,
        type,
        nextDate,
        daysUntil: Math.round((nextDateUtc - todayUtc) / 86_400_000),
      });
    }
  }

  return occasions.sort((left, right) => left.daysUntil - right.daysUntil);
}

export default async function Home() {
  const profileResult = await getCurrentProfile();
  const profile = profileResult?.profile;
  const user = profileResult?.user;
  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Utilisateur";
  const roleLabel =
    profile?.role === "super_admin" ? "Super administrateur" : "Responsable du bureau";
  let members: Member[] = [];
  let templates: MessageTemplate[] = [];
  let membersLoadError = false;
  let templatesLoadError = false;

  if (user) {
    const supabase = await createClient();
    const [membersResult, templatesResult] = await Promise.all([
      supabase
        .from("members")
        .select("id, full_name, phone, category, birth_date, marriage_date, is_active, photo_profile")
        .eq("is_active", true),
      supabase
        .from("message_templates")
        .select("id, type, title, content, is_default")
        .order("type")
        .order("title"),
    ]);

    members = (membersResult.data ?? []) as Member[];
    templates = (templatesResult.data ?? []) as MessageTemplate[];
    membersLoadError = Boolean(membersResult.error);
    templatesLoadError = Boolean(templatesResult.error);
  }

  const upcomingOccasions = getUpcomingOccasions(members);
  const stats = [
    {
      label: "Aujourd'hui",
      value: String(upcomingOccasions.filter((item) => item.daysUntil === 0).length),
      detail: "anniversaires",
    },
    {
      label: "Demain",
      value: String(upcomingOccasions.filter((item) => item.daysUntil === 1).length),
      detail: "rappels à préparer",
    },
    {
      label: "Cette semaine",
      value: String(new Set(upcomingOccasions.filter((item) => item.daysUntil <= 7).map((item) => item.memberId)).size),
      detail: "personnes concernées",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 border-b border-slate-800 pb-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-cyan-300 text-xl font-extrabold text-slate-950">
              A
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-sky-300/80">
                Association
              </p>
              <h1 className="text-lg font-bold text-white">ISAAC ET REBECCA</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
            <ThemeToggle />
            {profile && <span className="px-2 text-slate-300">{displayName} · {roleLabel}</span>}
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-white transition hover:border-sky-400 hover:text-sky-300"
              >
                Profil
              </Link>
              <Link
                href="/members"
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-white transition hover:border-sky-400 hover:text-sky-300"
              >
                Membres
              </Link>
              <LogoutButton />
            </div>
          </div>
        </header>

        <section className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">Vue d’ensemble</p>
            <h2 className="mt-1 text-3xl font-bold text-white">Bonjour, {displayName}</h2>
            <p className="mt-1 text-sm text-slate-400">Suivi des anniversaires et des prochains messages à préparer.</p>
          </div>
          {user?.email && <p className="text-sm text-slate-400">{user.email}</p>}
        </section>

        <section className="space-y-6">
          <div className="grid overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 sm:grid-cols-3">
            {stats.map((item, index) => (
              <div key={item.label} className={`p-5 ${index > 0 ? "border-t border-slate-800 sm:border-l sm:border-t-0" : ""}`}>
                <p className="text-sm text-slate-400">{item.label}</p>
                <div className="mt-4 flex items-end justify-between gap-2">
                  <span className="text-4xl font-semibold tabular-nums text-white">{item.value}</span>
                  <span className="text-xs text-slate-400">{item.detail}</span>
                </div>
              </div>
            ))}
          </div>

          <section className="border-y border-slate-800 py-6">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">À préparer</p>
                <h3 className="mt-1 text-xl font-bold text-white">Prochains anniversaires</h3>
              </div>
              <Link href="/members" className="text-sm font-medium text-sky-300 hover:text-cyan-200">
                Tous les membres
              </Link>
            </div>

            <div>
              {membersLoadError ? (
                <p role="alert" className="py-4 text-sm text-rose-300">
                  Impossible de charger les anniversaires depuis Supabase.
                </p>
              ) : upcomingOccasions.length === 0 ? (
                <p className="py-5 text-sm text-slate-400">
                  Aucun anniversaire à venir. Ajoutez les dates des membres pour alimenter ce tableau.
                </p>
              ) : (
                upcomingOccasions.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 border-b border-slate-800 py-4 last:border-b-0 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <span className="rounded-full bg-sky-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-300">
                          {item.type}
                        </span>
                        <span className="text-xs text-slate-400">
                          {item.daysUntil === 0 ? "Aujourd’hui" : `Dans ${item.daysUntil} jour${item.daysUntil === 1 ? "" : "s"}`}
                        </span>
                      </div>
                      <h4 className="text-lg font-semibold text-white">{item.memberName}</h4>
                      <p className="mt-1 text-sm capitalize text-slate-400">
                        {new Intl.DateTimeFormat("fr-FR", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        }).format(item.nextDate)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                        À préparer
                      </span>
                      <Link href="/members" className="rounded-lg bg-sky-400 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-300">
                        Ouvrir
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="py-2">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">Bibliothèque</p>
                <h3 className="mt-1 text-xl font-bold text-white">Modèles de messages</h3>
              </div>
              <Link href="/templates" className="text-sm font-medium text-sky-300 hover:text-cyan-200">
                Gérer les modèles
              </Link>
            </div>

            {templatesLoadError ? (
              <p role="alert" className="py-4 text-sm text-rose-300">Impossible de charger les modèles.</p>
            ) : templates.length === 0 ? (
              <p className="py-4 text-sm text-slate-400">Aucun modèle enregistré pour le moment.</p>
            ) : (
              <div className="divide-y divide-slate-800">
                {templates.slice(0, 3).map((template) => (
                  <div key={template.id} className="flex flex-col gap-2 py-4 first:pt-1 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-300">
                        {template.type === "birth" ? "Naissance" : "Mariage"}
                      </span>
                      <h4 className="font-semibold text-white">{template.title}</h4>
                    </div>
                    <p className="line-clamp-1 text-sm text-slate-400 sm:max-w-md">{template.content}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}
