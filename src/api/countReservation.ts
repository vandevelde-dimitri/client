import supabase from "@/utils/supabase"

export async function countReservations(isoDateTime: string): Promise<number> {
  if (!isoDateTime) return 0

  const { count, error } = await supabase
    .from("reservations") // <--- Vérifie bien que ta table s'appelle "reservations"
    .select("*", { count: "exact", head: true })
    .eq("creneau", isoDateTime) // Utilise l'égalité exacte

  if (error) {
    console.error("Erreur Supabase:", error.message)
    return 0
  }

  return count ?? 0
}
