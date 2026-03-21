import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import * as React from "react"
import { ReservationModal } from "./ReservationModal"

const TIME_SLOTS = ["09:30", "10:15", "11:00", "11:45", "12:30"]

export default function BookingInterface() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 items-start justify-center gap-8 lg:grid-cols-2">
        <Card className="shadow-lg">
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
            />
          </CardContent>
        </Card>

        <Card className="h-full shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              2. Créneaux de 45 min
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-100 pr-4">
              <div className="grid gap-3">
                {TIME_SLOTS.map((slot) => (
                  <ReservationModal key={slot} time={slot} date={date} />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
