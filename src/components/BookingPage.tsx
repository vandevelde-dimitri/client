import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCountReservations } from "@/hook/useCountReservation"
import * as React from "react"
import { ReservationModal } from "./ReservationModal"

const TIME_SLOTS = ["09:30", "10:15", "11:00", "11:45", "12:30"]

// --- COMPOSANT INTERMÉDIAIRE POUR GERER LE HOOK PAR CRÉNEAU ---
function SlotButton({ time, date }: { time: string; date: Date | undefined }) {
  const getLocalDatePart = (d: Date | undefined) => {
    if (!d) return ""
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const datePart = getLocalDatePart(date)
  const formattedDateTime = datePart ? `${datePart} ${time}:00` : ""

  const { data, isLoading } = useCountReservations(formattedDateTime)

  // FORCE LE TYPE : On s'assure que 'count' est traité comme un nombre
  // Si 'data' est un objet, on prend la clé. Si c'est déjà un nombre, on le garde.
  const count = typeof data === "number" ? data : 0

  // Maintenant la comparaison >= 2 fonctionnera sans erreur TS
  const isFull = count >= 2

  return (
    <ReservationModal
      time={time}
      date={date}
      disabled={isFull || isLoading || !date}
    />
  )
}

// --- PAGE PRINCIPALE ---
export default function BookingInterface() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 items-start justify-center gap-8 lg:grid-cols-2">
        {/* ÉTAPE 1 : CALENDRIER */}
        <Card className="border-none bg-card/50 shadow-lg backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              1. Choisir une date
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              // Optionnel : empêcher de réserver dans le passé
              disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
            />
          </CardContent>
        </Card>

        {/* ÉTAPE 2 : CRÉNEAUX */}
        <Card className="h-full border-none bg-card/50 shadow-lg backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              2. Créneaux de 45 min
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="grid gap-3">
                {TIME_SLOTS.map((slot) => (
                  <SlotButton key={slot} time={slot} date={date} />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
