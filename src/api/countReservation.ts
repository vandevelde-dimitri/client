import supabase from "@/utils/supabase"

export async function countReservations(time: string): Promise<number> {
  const { count, error } = await supabase
    .from("reservations")
    .select("*", { count: "exact", head: true })
    .eq("creneau", time)

  if (error) {
    console.error("Erreur :", error.message)
    return 0
  }

  return count ?? 0
}
