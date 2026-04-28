export type WorkoutSummary = {
  activePlan: string
  weeklyWorkouts: number
  adherence: number
  nextSession: string
}

export const workoutSummary: WorkoutSummary = {
  activePlan: 'Hipertrofia inteligente',
  weeklyWorkouts: 4,
  adherence: 86,
  nextSession: 'Treino B - Costas e bíceps',
}
