import { createReservations } from "@/api/createReservation"
import { useMutation } from "@tanstack/react-query"

export const useCreateReservations = () => {
  return useMutation({
    mutationFn: (payload: any) => createReservations(payload),
    onError: () => {},
    onSuccess: () => {},
  })
}
