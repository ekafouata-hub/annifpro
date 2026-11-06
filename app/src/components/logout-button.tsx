"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogout() {
    setErrorMessage("");

    try {
      const supabase = createClient();

      if (!supabase) {
        router.replace("/login");
        router.refresh();
        return;
      }

      const { error } = await supabase.auth.signOut();

      if (error) {
        setErrorMessage("La déconnexion a échoué. Réessayez.");
        return;
      }

      router.replace("/login");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "La déconnexion a échoué. Réessayez."
      );
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-white transition hover:border-sky-400 hover:text-sky-300"
      >
        Se déconnecter
      </button>
      {errorMessage && (
        <p role="alert" className="text-xs text-rose-300">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
