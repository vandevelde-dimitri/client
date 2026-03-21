import type { Reservation } from "@/types/reservation.type"
import supabase from "@/utils/supabase"

export async function createReservations(payload: any): Promise<Reservation[]> {
  const { data, error } = await supabase
    .from("reservations")
    .insert([payload])
    .select()

  if (error) {
    console.error("Error creating reservation:", error)
    return []
  }
  return data as Reservation[]
}
