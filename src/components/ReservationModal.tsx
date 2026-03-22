import { countReservations } from "@/api/countReservation"
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
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as yup from "yup"

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
  disabled?: boolean
}

export function ReservationModal({ time, disabled }: ReservationModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  const { mutate: createReservation, isPending } = useCreateReservations()
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

  const onSubmit = async (data: FormData) => {
    const currentCount = await countReservations(time)

    if (currentCount >= 2) {
      toast.error("Désolé, ce créneau vient d'être rempli !", {
        description: "Veuillez choisir un autre créneau.",
      })
      return
    }

    const finalPayload = {
      firstname: data.firstname,
      lastname: data.lastname,
      phone: data.phone,
      creneau: time,
    }

    createReservation(finalPayload, {
      onSuccess: () => {
        toast.success(`Réservation confirmée pour ${formattedTime} !`, {
          description: "Merci de votre intérêt pour notre MAM.",
        })
        reset()
        // La fermeture de la modale est gérée par le reset ou l'état open si besoin
      },
    })
  }

  const endTime = calculateEndTime(time)
  const formattedTime = time.replace(":", "h")

  return (
    <Dialog onOpenChange={(open) => !open && reset()}>
      <DialogTrigger asChild>
        <Button
          variant={disabled ? "secondary" : "outline"}
          className="h-14 w-full justify-between text-lg font-medium"
          disabled={disabled || isPending}
        >
          <span>{formattedTime}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {disabled ? "Complet" : `Jusqu'à ${endTime}`}
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Réserver le créneau de {formattedTime}</DialogTitle>
            <DialogDescription>
              Portes ouvertes le 11 avril. Créneau de {formattedTime} à{" "}
              {endTime}.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-6">
            <div className="grid gap-2">
              <Label htmlFor="firstname">Prénom</Label>
              <Input
                id="firstname"
                {...register("firstname")}
                placeholder="Ex: Jean"
                className={errors.firstname ? "border-destructive" : ""}
              />
              {errors.firstname && (
                <p className="text-xs text-destructive">
                  {errors.firstname.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lastname">Nom</Label>
              <Input
                id="lastname"
                {...register("lastname")}
                placeholder="Ex: Dupont"
                className={errors.lastname ? "border-destructive" : ""}
              />
              {errors.lastname && (
                <p className="text-xs text-destructive">
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
                placeholder="06 00 00 00 00"
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending
                ? "Validation en cours..."
                : "Confirmer la réservation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
