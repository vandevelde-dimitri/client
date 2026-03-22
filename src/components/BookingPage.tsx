"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCountReservations } from "@/hook/useCountReservation"
import { ReservationModal } from "./ReservationModal"

const TIME_SLOTS = ["09:30", "10:15", "11:00", "11:45", "12:30"]

function SlotButton({ time }: { time: string }) {
  const { data, isLoading } = useCountReservations(time)

  const count = typeof data === "number" ? data : 0
  const isFull = count >= 2

  return <ReservationModal time={time} disabled={isFull || isLoading} />
}

export default function BookingInterface() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <Card className="border-none bg-card/50 shadow-lg backdrop-blur">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary italic">
            Portes Ouvertes - 11 Avril
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Choisissez votre créneau de 45 minutes (2 places max)
          </p>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[450px] pr-4">
            <div className="grid gap-4">
              {TIME_SLOTS.map((slot) => (
                <SlotButton key={slot} time={slot} />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
