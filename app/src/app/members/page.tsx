import MembersManager from "@/components/members-manager";
import type { Member } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/server";

export default async function MembersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <MembersManager
        members={[]}
        canManage={false}
        loadError="Connectez-vous pour consulter l’annuaire."
      />
    );
  }

  const [membersResult, profileResult] = await Promise.all([
    supabase
      .from("members")
      .select("id, full_name, phone, category, birth_date, marriage_date, is_active, photo_profile, photo_couple")
      .order("full_name"),
    supabase.from("profiles").select("role").eq("id", user.id).single(),
  ]);

  return (
    <MembersManager
      members={(membersResult.data ?? []) as Member[]}
      canManage={profileResult.data?.role === "super_admin"}
      loadError={membersResult.error?.message}
    />
  );
}
