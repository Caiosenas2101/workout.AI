import { Link } from '@tanstack/react-router'
import { Activity, BarChart3, Download, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'

const actions = [
  {
    label: 'Acessar treino',
    to: '/workouts',
    icon: Activity,
    variant: 'default',
  },
  {
    label: 'Criar treino',
    to: '/create-workout',
    icon: Plus,
    variant: 'secondary',
  },
  {
    label: 'Exportar treino',
    icon: Download,
    variant: 'outline',
  },
  {
    label: 'Ver progresso',
    to: '/progress',
    icon: BarChart3,
    variant: 'secondary',
  },
] as const

export function HomePage() {
  return (
    <div className="flex min-h-[calc(100svh-7rem)] items-center justify-center py-6">
      <section className="w-full max-w-sm rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Workout AI</h2>
          <p className="text-base text-muted-foreground">Seu coach inteligente de treino.</p>
        </div>

        <div className="mt-8 grid gap-3">
          {actions.map((action) => {
            const Icon = action.icon
            const className = 'h-12 w-full justify-start px-4 text-base'

            if (!('to' in action)) {
              return (
                <Button
                  key={action.label}
                  className={className}
                  type="button"
                  variant={action.variant}
                >
                  <Icon className="size-5" />
                  {action.label}
                </Button>
              )
            }

            return (
              <Button key={action.label} asChild className={className} variant={action.variant}>
                <Link to={action.to}>
                  <Icon className="size-5" />
                  {action.label}
                </Link>
              </Button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
