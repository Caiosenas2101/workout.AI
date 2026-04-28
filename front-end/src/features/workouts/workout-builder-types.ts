export type WeekDayId = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export type WeekDay = {
  id: WeekDayId
  label: string
  shortLabel: string
}

export type WorkoutMethodId = 'low-volume' | 'high-volume' | 'hybrid'

export type WorkoutMethod = {
  id: WorkoutMethodId
  name: string
  description: string
  volumeHint: string
}

export type WorkoutSplitId =
  | 'full-body'
  | 'full-body-ab'
  | 'upper-lower'
  | 'push-pull-legs'
  | 'abc'
  | 'abcd'
  | 'abcde'
  | 'ppl-plus'
  | 'ppl-2x'
  | 'abc-2x'
  | 'active-rest'
  | 'custom'

export type WorkoutSplit = {
  id: WorkoutSplitId
  name: string
  description: string
  recommendedDays: number[]
}

export type MuscleGroupCategory = 'Superiores' | 'Inferiores' | 'Cardio'

export type MuscleGroup = {
  id: string
  name: string
  category: MuscleGroupCategory
}

export type Exercise = {
  id: string
  name: string
  muscleGroup: string
  subgroup: string
  equipment: string[]
  variations: string[]
}

export type SelectedExercise = Exercise & {
  selectedId: string
  sets: number
  reps: string
  rest: string
}

export type CardioConfig = {
  mode: string
  type: string
  intensity: string
  duration: string
  customDuration: string
  timing: string
}

export type WorkoutDay = {
  dayId: WeekDayId
  focus: string
  muscleGroups: string[]
  exercises: SelectedExercise[]
}

export type WorkoutPlan = {
  id: string
  name: string
  days: WeekDayId[]
  method: WorkoutMethodId
  split: WorkoutSplitId
  cardio: CardioConfig
  workoutDays: WorkoutDay[]
  createdAt: string
}
