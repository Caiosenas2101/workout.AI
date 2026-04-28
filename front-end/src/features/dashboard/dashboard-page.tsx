import { WorkoutGoalForm } from '@/components/forms/workout-goal-form'
import { useWorkoutSummary } from '@/hooks/use-workout-summary'

export function DashboardPage() {
  const { data } = useWorkoutSummary()

  const stats = [
    { label: 'Plano ativo', value: data?.activePlan },
    { label: 'Treinos/semana', value: data?.weeklyWorkouts },
    { label: 'Aderência', value: `${data?.adherence}%` },
    { label: 'Próxima sessão', value: data?.nextSession },
  ]

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Visão inicial para acompanhar evolução, rotina e recomendações.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.label} className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-xl font-semibold">{stat.value}</p>
          </article>
        ))}
      </section>

      <section className="rounded-lg border border-border bg-card p-4">
        <h3 className="text-base font-semibold">Novo objetivo</h3>
        <div className="mt-4">
          <WorkoutGoalForm />
        </div>
      </section>
    </div>
  )
}
