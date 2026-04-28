import useSWR from 'swr'

import { workoutSummary, type WorkoutSummary } from '@/services/mock'

export function useWorkoutSummary() {
  return useSWR<WorkoutSummary>('workout-summary', async () => workoutSummary, {
    fallbackData: workoutSummary,
  })
}
