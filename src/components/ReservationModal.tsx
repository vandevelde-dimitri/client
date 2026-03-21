import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import * as yup from "yup"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCreateReservations } from "@/hook/useReservations"

const schema = yup
  .object({
    firstname: yup
      .string()
      .min(2, "Le prénom est trop court")
      .required("Le prénom est requis"),
    lastname: yup
      .string()
      .min(2, "Le nom est trop court")
      .required("Le nom est requis"),
    phone: yup
      .string()
      .matches(/^[0-9\s]{10,14}$/, "Numéro de téléphone invalide")
      .required("Le téléphone est requis"),
  })
  .required()

type FormData = yup.InferType<typeof schema>

interface ReservationModalProps {
  time: string
  date: Date | undefined
}

export function ReservationModal({ time, date }: ReservationModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })
  const { mutate: createReservation } = useCreateReservations()

  const calculateEndTime = (startTime: string) => {
    const [h, m] = startTime.split(":").map(Number)
    let endM = m + 45
    let endH = h
    if (endM >= 60) {
      endH += 1
      endM -= 60
    }
    return `${endH}h${endM.toString().padStart(2, "0")}`
  }

  const onSubmit = (data: FormData) => {
    if (!date) return

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    const formattedDateTime = `${year}-${month}-${day} ${time.replace("h", ":")}:00`

    const finalPayload = {
      firstname: data.firstname,
      lastname: data.lastname,
      phone: data.phone,
      creneau: formattedDateTime,
    }

    createReservation(finalPayload)

    reset()
  }

  const displayDate = date?.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
  })
  const endTime = calculateEndTime(time)

  return (
    <Dialog onOpenChange={(open) => !open && reset()}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-14 w-full justify-between text-lg"
        >
          <span>{time.replace(":", "h")}</span>
          <span className="text-sm text-muted-foreground">
            Jusqu'à {endTime}
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-106.25">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Réserver le {displayDate}</DialogTitle>
            <DialogDescription>
              Créneau de {time.replace(":", "h")} à {endTime}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-6">
            <div className="grid gap-2">
              <Label htmlFor="firstname">Prénom</Label>
              <Input
                id="firstname"
                {...register("firstname")}
                placeholder="Jean"
                className={errors.firstname ? "border-destructive" : ""}
              />
              {errors.firstname && (
                <p className="text-sm text-destructive">
                  {errors.firstname.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lastname">Nom</Label>
              <Input
                id="lastname"
                {...register("lastname")}
                placeholder="Dupont"
                className={errors.lastname ? "border-destructive" : ""}
              />
              {errors.lastname && (
                <p className="text-sm text-destructive">
                  {errors.lastname.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                {...register("phone")}
                placeholder="06 12 34 56 78"
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full">
              Confirmer le rendez-vous
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
