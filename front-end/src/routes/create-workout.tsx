import { createFileRoute } from '@tanstack/react-router'

import { CreateWorkoutPage } from '@/features/workouts/create-workout-page'

export const Route = createFileRoute('/create-workout')({
  component: CreateWorkoutPage,
})
