"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  deleteMessageTemplate,
  saveMessageTemplate,
  setMessageTemplateDefault,
  type TemplateActionState,
} from "@/app/actions/templates";
import ThemeToggle from "@/components/theme-toggle";
import type { MessageTemplate } from "@/lib/database-types";

type TemplatesManagerProps = {
  templates: MessageTemplate[];
  canManage: boolean;
  loadError?: boolean;
};

export default function TemplatesManager({ templates, canManage, loadError }: TemplatesManagerProps) {
  const [filter, setFilter] = useState<"all" | "birth" | "marriage">("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const visibleTemplates = templates.filter((template) => filter === "all" || template.type === filter);

  function closeForm() {
    setIsFormOpen(false);
    setEditingTemplate(null);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-col gap-4 rounded-[24px] border border-slate-800 bg-slate-900/80 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-sky-300/80">Contenus</p>
            <h1 className="mt-2 text-2xl font-black text-white">Modèles de messages</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ThemeToggle />
            <Link href="/" className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white hover:border-sky-400">
              Tableau de bord
            </Link>
            {canManage && (
              <button
                type="button"
                onClick={() => {
                  setEditingTemplate(null);
                  setIsFormOpen(true);
                }}
                className="rounded-xl bg-sky-400 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-300"
              >
                + Nouveau modèle
              </button>
            )}
          </div>
        </header>

        <section className="rounded-[24px] border border-slate-800 bg-slate-900/80 p-5">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Bibliothèque</p>
              <h2 className="mt-1 text-xl font-bold text-white">{templates.length} modèle{templates.length === 1 ? "" : "s"}</h2>
            </div>
            <label className="text-xs font-medium text-slate-400">
              Type
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value as typeof filter)}
                className="mt-1.5 block rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-sky-400"
              >
                <option value="all">Tous</option>
                <option value="birth">Naissance</option>
                <option value="marriage">Mariage</option>
              </select>
            </label>
          </div>

          {loadError ? (
            <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-200">
              Impossible de charger les modèles depuis Supabase.
            </p>
          ) : visibleTemplates.length === 0 ? (
            <p className="rounded-xl border border-slate-800 bg-slate-950/60 p-8 text-center text-sm text-slate-400">
              Aucun modèle pour ce filtre. Créez-en un pour commencer.
            </p>
          ) : (
            <div className="divide-y divide-slate-800">
              {visibleTemplates.map((template) => (
                <article key={template.id} className="grid gap-4 py-5 first:pt-0 last:pb-0 md:grid-cols-[150px_minmax(0,1fr)_auto] md:items-start">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-xs font-semibold text-sky-300">
                      {template.type === "birth" ? "Naissance" : "Mariage"}
                    </span>
                    {template.is_default && (
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] text-emerald-300">
                        Par défaut
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white">{template.title}</h3>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">{template.content}</p>
                  </div>
                  {canManage && (
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTemplate(template);
                          setIsFormOpen(true);
                        }}
                        className="text-sky-300 hover:text-cyan-200"
                      >
                        Modifier
                      </button>
                      <form action={setMessageTemplateDefault}>
                        <input type="hidden" name="template_id" value={template.id} />
                        <input type="hidden" name="type" value={template.type} />
                        <input type="hidden" name="make_default" value={String(!template.is_default)} />
                        <button type="submit" className="text-slate-400 hover:text-white">
                          {template.is_default ? "Retirer le défaut" : "Définir par défaut"}
                        </button>
                      </form>
                      <form
                        action={deleteMessageTemplate}
                        onSubmit={(event) => {
                          if (!window.confirm(`Supprimer le modèle « ${template.title} » ?`)) {
                            event.preventDefault();
                          }
                        }}
                      >
                        <input type="hidden" name="template_id" value={template.id} />
                        <button type="submit" className="text-rose-300 hover:text-rose-200">Supprimer</button>
                      </form>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        {isFormOpen && canManage && (
          <TemplateForm
            key={editingTemplate?.id ?? "new-template"}
            template={editingTemplate}
            onClose={closeForm}
          />
        )}
      </div>
    </main>
  );
}

function TemplateForm({ template, onClose }: { template: MessageTemplate | null; onClose: () => void }) {
  const [state, formAction, isPending] = useActionState<TemplateActionState, FormData>(saveMessageTemplate, {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
      <section role="dialog" aria-modal="true" aria-labelledby="template-form-title" className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-sky-300/80">Bibliothèque</p>
            <h2 id="template-form-title" className="mt-1 text-xl font-bold text-white">
              {template ? "Modifier le modèle" : "Créer un modèle"}
            </h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Fermer" className="text-2xl leading-none text-slate-400 hover:text-white">×</button>
        </div>

        {state.success ? (
          <div className="space-y-5">
            <p role="status" className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
              Le modèle a été enregistré.
            </p>
            <div className="flex justify-end">
              <button type="button" onClick={onClose} className="rounded-xl bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-300">Fermer</button>
            </div>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            {template && <input type="hidden" name="template_id" value={template.id} />}
            <label className="block text-sm text-slate-300">
              Type de message
              <select name="type" defaultValue={template?.type ?? "birth"} className="mt-1.5 block w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:border-sky-400">
                <option value="birth">Naissance</option>
                <option value="marriage">Mariage</option>
              </select>
            </label>
            <label className="block text-sm text-slate-300">
              Titre
              <input name="title" required maxLength={120} defaultValue={template?.title ?? ""} className="mt-1.5 block w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:border-sky-400" />
            </label>
            <label className="block text-sm text-slate-300">
              Message
              <textarea name="content" required rows={7} maxLength={4000} defaultValue={template?.content ?? ""} className="mt-1.5 block w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:border-sky-400" />
            </label>
            {state.error && <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-200">{state.error}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:text-white">Annuler</button>
              <button type="submit" disabled={isPending} className="rounded-xl bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-300 disabled:opacity-60">
                {isPending ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}