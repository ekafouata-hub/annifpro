"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type TemplateActionState = {
  error?: string;
  success?: boolean;
};

async function getAdminClient() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Connectez-vous pour gérer les modèles.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "super_admin") {
    throw new Error("Seul un super administrateur peut gérer les modèles.");
  }

  return supabase;
}

export async function saveMessageTemplate(
  _previousState: TemplateActionState,
  formData: FormData
): Promise<TemplateActionState> {
  try {
    const title = String(formData.get("title") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();
    const type = String(formData.get("type") ?? "");
    const templateId = String(formData.get("template_id") ?? "");

    if (!title || !content) {
      throw new Error("Le titre et le contenu sont obligatoires.");
    }
    if (type !== "birth" && type !== "marriage") {
      throw new Error("Choisissez un type de message valide.");
    }

    const supabase = await getAdminClient();
    const template = { title, content, type };

    if (templateId) {
      const { error } = await supabase
        .from("message_templates")
        .update(template)
        .eq("id", templateId);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("message_templates").insert(template);
      if (error) throw error;
    }

    revalidatePath("/templates");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "L’enregistrement a échoué.",
    };
  }
}

export async function setMessageTemplateDefault(formData: FormData) {
  const templateId = String(formData.get("template_id") ?? "");
  const type = String(formData.get("type") ?? "");
  const makeDefault = String(formData.get("make_default")) === "true";

  if (!templateId || (type !== "birth" && type !== "marriage")) {
    throw new Error("Modèle introuvable.");
  }

  const supabase = await getAdminClient();

  if (makeDefault) {
    const { error } = await supabase
      .from("message_templates")
      .update({ is_default: false })
      .eq("type", type);
    if (error) throw new Error("Impossible de modifier le modèle par défaut.");
  }

  const { error } = await supabase
    .from("message_templates")
    .update({ is_default: makeDefault })
    .eq("id", templateId)
    .eq("type", type);

  if (error) throw new Error("Impossible de modifier le modèle par défaut.");
  revalidatePath("/templates");
}

export async function deleteMessageTemplate(formData: FormData) {
  const templateId = String(formData.get("template_id") ?? "");
  if (!templateId) throw new Error("Modèle introuvable.");

  const supabase = await getAdminClient();
  const { error } = await supabase.from("message_templates").delete().eq("id", templateId);

  if (error) throw new Error("Impossible de supprimer ce modèle.");
  revalidatePath("/templates");
  revalidatePath("/");
}