"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const supabase = createClient();

      if (!supabase) {
        setErrorMessage("Supabase n'est pas configuré.");
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setErrorMessage("Impossible d'envoyer le lien. Réessayez plus tard.");
        return;
      }

      setMessage("Si cette adresse est connue, un lien de réinitialisation va être envoyé.");
    } catch {
      setErrorMessage("Impossible d'envoyer le lien. Réessayez plus tard.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-[28px] border border-sky-400/20 bg-slate-900/90 p-8 shadow-2xl shadow-sky-950/30">
        <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-sky-300/80">
          Récupération du compte
        </p>
        <h1 className="text-3xl font-black text-white">Mot de passe oublié</h1>
        <p className="mb-7 mt-2 text-sm leading-6 text-slate-300">
          Nous vous enverrons un lien pour choisir un nouveau mot de passe.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm text-slate-300">
              Adresse e-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
            />
          </div>

          {message && (
            <p role="status" className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {message}
            </p>
          )}
          {errorMessage && (
            <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-gradient-to-r from-sky-400 to-cyan-300 px-5 py-3 font-bold text-slate-950 shadow-lg shadow-sky-500/20 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Envoi..." : "Envoyer le lien"}
          </button>
        </form>

        <Link href="/login" className="mt-5 block text-center text-sm text-sky-300 transition hover:text-cyan-200">
          Retour à la connexion
        </Link>
      </section>
    </main>
  );
}