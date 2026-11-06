"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { deleteMember, saveMember, setMemberActive, type MemberActionState } from "@/app/actions/members";
import { formatDateFr, type Member } from "@/lib/mock-data";
import ThemeToggle from "@/components/theme-toggle";

type MembersManagerProps = {
  members: Member[];
  canManage: boolean;
  loadError?: string;
};

export default function MembersManager({ members, canManage, loadError }: MembersManagerProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const filteredMembers = members.filter((member) => {
    const searchMatches = `${member.full_name} ${member.phone}`
      .toLocaleLowerCase("fr-FR")
      .includes(search.toLocaleLowerCase("fr-FR"));
    const statusMatches =
      status === "all" || (status === "active" ? member.is_active : !member.is_active);

    return searchMatches && statusMatches;
  });
  const activeCount = members.filter((member) => member.is_active).length;

  function closeForm() {
    setIsFormOpen(false);
    setEditingMember(null);
  }

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

          <div className="flex flex-wrap items-center gap-3">
            <ThemeToggle />
            <Link
              href="/"
              className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-white transition hover:border-sky-400 hover:text-sky-300"
            >
              Tableau de bord
            </Link>
            {canManage && (
              <button
                type="button"
                onClick={() => {
                  setEditingMember(null);
                  setIsFormOpen(true);
                }}
                className="rounded-xl bg-sky-400 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
              >
                + Ajouter un membre
              </button>
            )}
          </div>
        </header>

        <section className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-5 shadow-2xl shadow-slate-950/30">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-slate-400">Membres actifs</p>
              <h2 className="text-3xl font-black text-white">{activeCount}</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-[minmax(220px,1fr)_160px]">
              <label className="text-xs font-medium text-slate-400">
                Rechercher
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Nom ou téléphone"
                  className="mt-1.5 block w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-sky-400"
                />
              </label>
              <label className="text-xs font-medium text-slate-400">
                Statut
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value as typeof status)}
                  className="mt-1.5 block w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-sky-400"
                >
                  <option value="all">Tous</option>
                  <option value="active">Actifs</option>
                  <option value="inactive">Inactifs</option>
                </select>
              </label>
            </div>
          </div>

          {loadError ? (
            <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              Impossible de charger les membres. Vérifiez la connexion à Supabase.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="min-w-[760px] divide-y divide-slate-800 text-left text-sm">
                <thead className="bg-slate-950/70 text-slate-300">
                  <tr>
                    <th className="px-4 py-3 font-medium">Nom</th>
                    <th className="px-4 py-3 font-medium">Catégorie</th>
                    <th className="px-4 py-3 font-medium">Téléphone</th>
                    <th className="px-4 py-3 font-medium">Naissance</th>
                    <th className="px-4 py-3 font-medium">Mariage</th>
                    <th className="px-4 py-3 font-medium">Statut</th>
                    {canManage && <th className="px-4 py-3 font-medium">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/40">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-800/50">
                      <td className="px-4 py-3 font-medium text-white">{member.full_name}</td>
                      <td className="px-4 py-3 text-slate-300">{member.category}</td>
                      <td className="px-4 py-3 text-slate-300">{member.phone}</td>
                      <td className="px-4 py-3 text-slate-300">{formatDateFr(member.birth_date)}</td>
                      <td className="px-4 py-3 text-slate-300">{formatDateFr(member.marriage_date)}</td>
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
                      {canManage && (
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingMember(member);
                                setIsFormOpen(true);
                              }}
                              className="text-sky-300 hover:text-cyan-200"
                            >
                              Modifier
                            </button>
                            <form action={setMemberActive}>
                              <input type="hidden" name="member_id" value={member.id} />
                              <input type="hidden" name="is_active" value={String(!member.is_active)} />
                              <button type="submit" className="text-slate-400 hover:text-white">
                                {member.is_active ? "Désactiver" : "Réactiver"}
                              </button>
                            </form>
                            <form
                              action={deleteMember}
                              onSubmit={(event) => {
                                if (!window.confirm(`Supprimer définitivement ${member.full_name} ?`)) {
                                  event.preventDefault();
                                }
                              }}
                            >
                              <input type="hidden" name="member_id" value={member.id} />
                              <button type="submit" className="text-rose-300 hover:text-rose-200">
                                Supprimer
                              </button>
                            </form>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                  {filteredMembers.length === 0 && (
                    <tr>
                      <td colSpan={canManage ? 7 : 6} className="px-4 py-12 text-center text-slate-400">
                        {members.length === 0
                          ? "Aucun membre enregistré."
                          : "Aucun membre ne correspond à la recherche."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {isFormOpen && canManage && (
          <MemberForm
            key={editingMember?.id ?? "new-member"}
            member={editingMember}
            onClose={closeForm}
          />
        )}
      </div>
    </main>
  );
}

function MemberForm({ member, onClose }: { member: Member | null; onClose: () => void }) {
  const [state, formAction, isPending] = useActionState<MemberActionState, FormData>(saveMember, {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="member-form-title"
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-sky-300/80">Annuaire</p>
            <h2 id="member-form-title" className="mt-1 text-xl font-bold text-white">
              {member ? "Modifier le membre" : "Ajouter un membre"}
            </h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Fermer" className="text-2xl leading-none text-slate-400 hover:text-white">
            ×
          </button>
        </div>

        {state.success ? (
          <div className="space-y-5">
            <p role="status" className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              Le membre a été enregistré.
            </p>
            <div className="flex justify-end">
              <button type="button" onClick={onClose} className="rounded-xl bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-300">
                Fermer
              </button>
            </div>
          </div>
        ) : (
        <form action={formAction} className="grid gap-4 sm:grid-cols-2">
          {member && <input type="hidden" name="member_id" value={member.id} />}
          <label className="text-sm text-slate-300 sm:col-span-2">
            Nom complet
            <input
              name="full_name"
              required
              defaultValue={member?.full_name ?? ""}
              className="mt-1.5 block w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-400"
            />
          </label>
          <label className="text-sm text-slate-300">
            Téléphone
            <input
              name="phone"
              type="tel"
              required
              defaultValue={member?.phone ?? ""}
              className="mt-1.5 block w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-400"
            />
          </label>
          <label className="text-sm text-slate-300">
            Catégorie
            <select
              name="category"
              defaultValue={member?.category ?? "Filleul"}
              className="mt-1.5 block w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-400"
            >
              <option value="Couple">Couple</option>
              <option value="Filleul">Filleul</option>
              <option value="Filleule">Filleule</option>
            </select>
          </label>
          <label className="text-sm text-slate-300">
            Date de naissance
            <input
              name="birth_date"
              type="date"
              defaultValue={member?.birth_date ?? ""}
              className="mt-1.5 block w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-400"
            />
          </label>
          <label className="text-sm text-slate-300">
            Date de mariage
            <input
              name="marriage_date"
              type="date"
              defaultValue={member?.marriage_date ?? ""}
              className="mt-1.5 block w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-400"
            />
          </label>
          <label className="text-sm text-slate-300">
            URL photo individuelle
            <input
              name="photo_profile"
              type="url"
              defaultValue={member?.photo_profile ?? ""}
              placeholder="https://..."
              className="mt-1.5 block w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-400"
            />
          </label>
          <label className="text-sm text-slate-300">
            URL photo du couple
            <input
              name="photo_couple"
              type="url"
              defaultValue={member?.photo_couple ?? ""}
              placeholder="https://..."
              className="mt-1.5 block w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-400"
            />
          </label>

          {state.error && (
            <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200 sm:col-span-2">
              {state.error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2 sm:col-span-2">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:text-white">
              Annuler
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-xl bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-300 disabled:opacity-60"
            >
              {isPending ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
        )}
      </section>
    </div>
  );
}