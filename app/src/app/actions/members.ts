"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type MemberActionState = {
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
    throw new Error("Connectez-vous pour gérer les membres.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "super_admin") {
    throw new Error("Seul un super administrateur peut gérer les membres.");
  }

  return supabase;
}

function readMemberForm(formData: FormData) {
  const full_name = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const birth_date = String(formData.get("birth_date") ?? "") || null;
  const marriage_date = String(formData.get("marriage_date") ?? "") || null;
  const photo_profile = String(formData.get("photo_profile") ?? "").trim() || null;
  const photo_couple = String(formData.get("photo_couple") ?? "").trim() || null;

  if (!full_name || !phone) {
    throw new Error("Le nom et le téléphone sont obligatoires.");
  }

  if (!birth_date && !marriage_date) {
    throw new Error("Indiquez une date de naissance ou de mariage.");
  }

  if (!["Couple", "Filleul", "Filleule"].includes(category)) {
    throw new Error("Choisissez une catégorie valide.");
  }

  for (const photoUrl of [photo_profile, photo_couple]) {
    if (!photoUrl) continue;

    try {
      const parsedUrl = new URL(photoUrl);
      if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
        throw new Error();
      }
    } catch {
      throw new Error("Les photos doivent utiliser une URL HTTP ou HTTPS valide.");
    }
  }

  return { full_name, phone, category, birth_date, marriage_date, photo_profile, photo_couple };
}

export async function saveMember(
  _previousState: MemberActionState,
  formData: FormData
): Promise<MemberActionState> {
  try {
    const supabase = await getAdminClient();
    const member = readMemberForm(formData);
    const memberId = String(formData.get("member_id") ?? "");

    if (memberId) {
      const { error } = await supabase
        .from("members")
        .update(member)
        .eq("id", memberId);

      if (error) throw error;
    } else {
      const { error } = await supabase.from("members").insert(member);
      if (error) throw error;
    }

    revalidatePath("/members");
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "L’enregistrement a échoué.",
    };
  }
}

export async function setMemberActive(formData: FormData) {
  const memberId = String(formData.get("member_id") ?? "");
  const isActive = String(formData.get("is_active")) === "true";

  if (!memberId) {
    throw new Error("Membre introuvable.");
  }

  const supabase = await getAdminClient();
  const { error } = await supabase
    .from("members")
    .update({ is_active: isActive })
    .eq("id", memberId);

  if (error) {
    throw new Error("Impossible de modifier le statut du membre.");
  }

  revalidatePath("/members");
}

export async function deleteMember(formData: FormData) {
  const memberId = String(formData.get("member_id") ?? "");

  if (!memberId) {
    throw new Error("Membre introuvable.");
  }

  const supabase = await getAdminClient();
  const { error } = await supabase.from("members").delete().eq("id", memberId);

  if (error) {
    throw new Error("Impossible de supprimer ce membre.");
  }

  revalidatePath("/members");
  revalidatePath("/");
}