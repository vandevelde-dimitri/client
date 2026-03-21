import { countReservations } from "@/api/countReservation"
import { useQuery } from "@tanstack/react-query"

export const useCountReservations = (isoDateTime: string) => {
  return useQuery<number>({
    queryKey: ["reservation-count", isoDateTime],
    queryFn: () => countReservations(isoDateTime),
    enabled: !!isoDateTime,
  })
}
