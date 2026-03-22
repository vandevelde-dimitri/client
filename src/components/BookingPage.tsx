import { Card, CardContent } from "@/components/ui/card"
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
    <div className="min-h-screen bg-slate-50/50">
      {/* 1. Header / Hero */}
      <header className="border-b bg-white px-4 py-16 text-center">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            {/* Ton icone de MAM ici */}
            <span className="text-4xl">🏠</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 lg:text-5xl">
            Portes Ouvertes de la MAM
          </h1>
          <p className="text-xl text-muted-foreground">
            Le samedi 11 avril — Venez découvrir notre univers et poser toutes
            vos questions.
          </p>
        </div>
      </header>

      {/* 2. Section Réservation */}
      <main className="container mx-auto max-w-2xl px-4 py-12">
        <div className="space-y-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-8 w-1 rounded-full bg-primary" />
            <h2 className="text-2xl font-semibold">Choisissez votre créneau</h2>
          </div>

          <Card className="border-none bg-white/80 shadow-xl shadow-slate-200/50 backdrop-blur">
            <CardContent className="pt-6">
              <ScrollArea className="pr-4">
                <div className="grid gap-4">
                  {TIME_SLOTS.map((slot) => (
                    <SlotButton key={slot} time={slot} />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground italic">
            Chaque visite dure 45 minutes pour vous accorder tout le temps
            nécessaire.
          </p>
        </div>
      </main>

      {/* 3. Footer */}
      <footer className="py-8 text-center text-sm text-slate-400">
        © 2026 MAM "Les tendres frimousses" — 39 rue blanche dupont, 62880
        Estevelles
      </footer>
    </div>
  )
}
