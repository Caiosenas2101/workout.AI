import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

const workoutGoalSchema = z.object({
  goal: z.string().min(3, 'Informe um objetivo com pelo menos 3 caracteres.'),
  sessionsPerWeek: z.coerce
    .number()
    .min(1, 'Use no mínimo 1 treino.')
    .max(7, 'Use no máximo 7 treinos.'),
})

type WorkoutGoalFormValues = z.infer<typeof workoutGoalSchema>

export function WorkoutGoalForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WorkoutGoalFormValues>({
    resolver: zodResolver(workoutGoalSchema),
    defaultValues: {
      goal: 'Ganhar massa muscular',
      sessionsPerWeek: 4,
    },
  })

  function onSubmit(values: WorkoutGoalFormValues) {
    toast.success('Objetivo salvo', {
      description: `${values.goal} com ${values.sessionsPerWeek} treinos por semana.`,
    })
  }

  return (
    <form className="grid gap-4 sm:grid-cols-[1fr_160px_auto]" onSubmit={handleSubmit(onSubmit)}>
      <Field>
        <FieldLabel htmlFor="goal">Objetivo</FieldLabel>
        <Input id="goal" placeholder="Ex: Emagrecer" {...register('goal')} />
        {errors.goal ? <FieldError>{errors.goal.message}</FieldError> : null}
      </Field>

      <Field>
        <FieldLabel htmlFor="sessionsPerWeek">Treinos/semana</FieldLabel>
        <Input
          id="sessionsPerWeek"
          type="number"
          min={1}
          max={7}
          {...register('sessionsPerWeek')}
        />
        {errors.sessionsPerWeek ? (
          <FieldError>{errors.sessionsPerWeek.message}</FieldError>
        ) : null}
      </Field>

      <Button className="self-end" disabled={isSubmitting} type="submit">
        Salvar
      </Button>
    </form>
  )
}
