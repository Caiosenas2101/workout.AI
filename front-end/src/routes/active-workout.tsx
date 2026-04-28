import { createFileRoute } from '@tanstack/react-router'

import { ActiveWorkoutPage } from '@/features/workouts/active-workout-page'

export const Route = createFileRoute('/active-workout')({
  component: ActiveWorkoutPage,
})
