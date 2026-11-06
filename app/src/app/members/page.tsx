import Link from "next/link";
import { formatDateFr, mockMembers } from "@/lib/mock-data";

export default function MembersPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-col gap-4 rounded-[24px] border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/30 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-sky-300/80">
              Gestion des membres
            </p>
            <h1 className="mt-2 text-2xl font-black text-white">
              Annuaire de l’association
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-white transition hover:border-sky-400 hover:text-sky-300"
            >
              Tableau de bord
            </Link>
            <button className="rounded-xl bg-sky-400 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-300">
              Ajouter un membre
            </button>
          </div>
        </header>

        <section className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-5 shadow-2xl shadow-slate-950/30">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">Membres actifs</p>
              <h2 className="text-3xl font-black text-white">{mockMembers.length}</h2>
            </div>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              Données de démonstration
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-800">
            <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
              <thead className="bg-slate-950/70 text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-medium">Nom</th>
                  <th className="px-4 py-3 font-medium">Catégorie</th>
                  <th className="px-4 py-3 font-medium">Téléphone</th>
                  <th className="px-4 py-3 font-medium">Naissance</th>
                  <th className="px-4 py-3 font-medium">Mariage</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/40">
                {mockMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-800/50">
                    <td className="px-4 py-3 font-medium text-white">{member.full_name}</td>
                    <td className="px-4 py-3 text-slate-300">{member.category}</td>
                    <td className="px-4 py-3 text-slate-300">{member.phone}</td>
                    <td className="px-4 py-3 text-slate-300">
                      {formatDateFr(member.birth_date)}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {formatDateFr(member.marriage_date)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                          member.is_active
                            ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                            : "border border-rose-500/30 bg-rose-500/10 text-rose-300"
                        }`}
                      >
                        {member.is_active ? "Actif" : "Inactif"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
