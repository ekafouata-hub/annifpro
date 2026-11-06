import { redirect } from "next/navigation";
import TemplatesManager from "@/components/templates-manager";
import type { MessageTemplate } from "@/lib/database-types";
import { createClient, getCurrentProfile } from "@/lib/supabase/server";

export default async function TemplatesPage() {
  const profileResult = await getCurrentProfile();

  if (!profileResult?.user) {
    redirect("/login?next=%2Ftemplates");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("message_templates")
    .select("id, type, title, content, is_default")
    .order("type")
    .order("title");

  return (
    <TemplatesManager
      templates={(data ?? []) as MessageTemplate[]}
      canManage={profileResult.profile?.role === "super_admin"}
      loadError={Boolean(error)}
    />
  );
}