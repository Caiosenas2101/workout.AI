import { Link, Outlet } from '@tanstack/react-router'
import { Activity, Dumbbell, Settings } from 'lucide-react'

import { ThemeToggle } from '@/components/app/theme-toggle'

const navigation = [
  { to: '/', label: 'Dashboard', icon: Activity },
  { to: '/workouts', label: 'Treinos', icon: Dumbbell },
  { to: '/settings', label: 'Ajustes', icon: Settings },
] as const

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-card px-4 py-5 md:block">
        <div className="flex h-full flex-col">
          <div className="px-2">
            <p className="text-lg font-semibold">Workout AI</p>
            <p className="text-sm text-muted-foreground">Seu treino, mais inteligente.</p>
          </div>

          <nav className="mt-8 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                activeProps={{
                  className: 'bg-secondary text-foreground',
                }}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur md:px-8">
          <div>
            <p className="text-sm text-muted-foreground">Aplicativo</p>
            <h1 className="text-base font-semibold">Workout AI</h1>
          </div>
          <ThemeToggle />
        </header>

        <main className="px-4 py-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
