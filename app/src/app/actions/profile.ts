"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { updateCurrentProfile } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const result = await updateCurrentProfile(fullName);

  if (result.error) {
    throw new Error(result.error);
  }

  revalidatePath("/");
  revalidatePath("/profile");
  redirect("/profile");
}
