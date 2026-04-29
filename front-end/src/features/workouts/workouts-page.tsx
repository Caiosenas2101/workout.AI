import * as React from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  Activity,
  ArrowLeft,
  CalendarDays,
  Check,
  Clock,
  Dumbbell,
  Edit3,
  Flame,
  History,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Save,
  SkipForward,
  Trash2,
  X,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

import { weekDays, workoutMethods, workoutSplits } from './workout-builder-data'
import type { CardioConfig, WorkoutPlan } from './workout-builder-types'

type SetType = 'Aquecimento' | 'Feeder' | 'Válida' | 'Top set' | 'Back-off'
type CardioType = 'Caminhada' | 'Corrida' | 'Bicicleta' | 'Escada' | 'Elíptico' | 'HIIT'
type CardioTiming = 'Antes do treino' | 'Depois do treino' | 'Separado da musculação'
type SessionStatus = 'concluído' | 'encerrado antes do fim'
type Screen = 'list' | 'overview' | 'active' | 'summary'

type WorkoutSet = {
  id: string
  number: number
  type: SetType
  targetReps: string
  suggestedLoad: string
  restSeconds: number
}

type WorkoutExercise = {
  id: string
  name: string
  muscleGroup: string
  subgroup?: string
  equipment: string
  note: string
  plannedSets: number
  targetReps: string
  plannedRestSeconds: number
  sets: WorkoutSet[]
}

type CardioPlan = {
  id: string
  type: CardioType
  duration: string
  intensity: string
  timing: CardioTiming
}

type WorkoutDay = {
  id: string
  weekday: string
  focus: string
  muscleGroups: string[]
  exercises: WorkoutExercise[]
  cardio?: CardioPlan
}

type SavedWorkout = {
  id: string
  name: string
  methodology: 'Low Volume' | 'High Volume' | 'Híbrido'
  split: 'Full Body' | 'Upper/Lower' | 'Push/Pull/Legs' | 'ABC' | 'ABCD' | 'ABCDE' | 'Personalizado'
  weekdays: string[]
  lastAccessed?: string
  days: WorkoutDay[]
}

type CompletedSet = {
  completed: boolean
  load: string
  reps: string
  note: string
}

type CardioSession = {
  completed: boolean
  time: string
  distance: string
  note: string
}

type WorkoutSummaryData = {
  date: string
  workoutName: string
  dayFocus: string
  durationSeconds: number
  completedSets: number
  completedExercises: number
  totalLoad: number
  status: SessionStatus
  cardio?: CardioPlan & CardioSession
}

type WorkoutHistoryItem = WorkoutSummaryData & {
  id: string
  exercises: {
    name: string
    sets: CompletedSet[]
  }[]
}

const historyStorageKey = 'workout-ai-history'
const workoutsStorageKey = 'workout-ai-workouts'
const removedMockWorkoutIds = new Set(['mock-low-volume', 'mock-hybrid'])
const removedMockWorkoutNames = new Set(['Low Volume Hipertrofia', 'Híbrido Performance'])
const fallbackCardioConfig: CardioConfig = {
  mode: 'Sem cardio',
  type: 'Caminhada',
  intensity: 'Leve',
  duration: '20 min',
  customDuration: '',
  timing: 'Depois do treino',
}

function exercise(
  id: string,
  name: string,
  muscleGroup: string,
  subgroup: string,
  equipment: string,
  note: string,
  reps: string,
  load: string,
  restSeconds: number,
  setTypes: SetType[],
): WorkoutExercise {
  return {
    id,
    name,
    muscleGroup,
    subgroup,
    equipment,
    note,
    plannedSets: setTypes.length,
    targetReps: reps,
    plannedRestSeconds: restSeconds,
    sets: setTypes.map((type, index) => ({
      id: `${id}-${index + 1}`,
      number: index + 1,
      type,
      targetReps: type === 'Back-off' ? '10-12' : reps,
      suggestedLoad: type === 'Aquecimento' ? 'leve' : load,
      restSeconds,
    })),
  }
}

function parseRestSeconds(rest: string) {
  const lowerRest = rest.toLowerCase()
  const minuteMatch = lowerRest.match(/(\d+)\s*(min|m)/)
  const secondMatch = lowerRest.match(/(\d+)\s*s/)

  if (minuteMatch) {
    return Number(minuteMatch[1]) * 60
  }

  if (secondMatch) {
    return Number(secondMatch[1])
  }

  return 90
}

function mapStoredPlan(plan: WorkoutPlan): SavedWorkout {
  const method = workoutMethods.find((item) => item.id === plan.method)?.name ?? 'Low Volume'
  const split = workoutSplits.find((item) => item.id === plan.split)?.name ?? 'Personalizado'
  const planDays = Array.isArray(plan.days) ? plan.days : []
  const workoutDays = Array.isArray(plan.workoutDays) ? plan.workoutDays : []
  const cardio = plan.cardio ?? fallbackCardioConfig
  const weekdays = planDays.map((dayId) => weekDays.find((day) => day.id === dayId)?.label ?? dayId)

  return {
    id: plan.id || crypto.randomUUID(),
    name: plan.name || 'Meu treino',
    methodology: method === 'High Volume' ? 'High Volume' : method === 'Híbrido' ? 'Híbrido' : 'Low Volume',
    split: normalizeSplit(split),
    weekdays,
    lastAccessed: 'Criado localmente',
    days: workoutDays.map((day, dayIndex) => {
      const weekday = weekDays.find((item) => item.id === day.dayId)?.label ?? `Dia ${dayIndex + 1}`
      const hasCardio = cardio.mode !== 'Sem cardio' && (day.focus.toLowerCase().includes('cardio') || cardio.mode.includes('treino'))

      return {
        id: `${plan.id}-${day.dayId}`,
        weekday,
        focus: day.focus,
        muscleGroups: Array.isArray(day.muscleGroups) ? day.muscleGroups : [],
        cardio: hasCardio
          ? {
              id: `${plan.id}-${day.dayId}-cardio`,
              type: normalizeCardioType(cardio.type),
              duration: cardio.duration === 'Personalizado' ? cardio.customDuration || '20 min' : cardio.duration,
              intensity: cardio.intensity,
              timing: cardio.timing === 'Em dia de descanso' ? 'Separado da musculação' : (cardio.timing as CardioTiming),
            }
          : undefined,
        exercises: (Array.isArray(day.exercises) ? day.exercises : []).map((selectedExercise) => {
          const restSeconds = parseRestSeconds(selectedExercise.rest)
          const equipment = Array.isArray(selectedExercise.equipment)
            ? selectedExercise.equipment[0]
            : selectedExercise.equipment
          const variations = Array.isArray(selectedExercise.variations) ? selectedExercise.variations : []
          const setCount = Math.max(1, Number(selectedExercise.sets) || 1)
          const setTypes = Array.from({ length: setCount }, (_, index) => {
            if (index === 0 && setCount > 2) return 'Feeder'
            return 'Válida'
          }) as SetType[]

          return exercise(
            selectedExercise.selectedId,
            selectedExercise.name,
            selectedExercise.muscleGroup,
            selectedExercise.subgroup,
            equipment ?? 'Livre',
            variations[0] ?? 'Execute com controle.',
            selectedExercise.reps,
            '0 kg',
            restSeconds,
            setTypes,
          )
        }),
      }
    }),
  }
}

function normalizeSplit(split: string): SavedWorkout['split'] {
  if (split.includes('Upper/Lower')) return 'Upper/Lower'
  if (split.includes('Push/Pull/Legs')) return 'Push/Pull/Legs'
  if (split.includes('Full Body')) return 'Full Body'
  if (split === 'ABC') return 'ABC'
  if (split === 'ABCD') return 'ABCD'
  if (split === 'ABCDE') return 'ABCDE'
  return 'Personalizado'
}

function normalizeCardioType(type: string): CardioType {
  if (['Caminhada', 'Corrida', 'Bicicleta', 'Escada', 'Elíptico', 'HIIT'].includes(type)) {
    return type as CardioType
  }

  return 'Caminhada'
}

function getStoredWorkouts() {
  try {
    const storedPlans = window.localStorage.getItem(workoutsStorageKey)
    const parsedPlans = storedPlans ? (JSON.parse(storedPlans) as unknown) : []
    const plans = (Array.isArray(parsedPlans) ? parsedPlans : []).filter((plan) => {
      const storedPlan = plan as Partial<WorkoutPlan>
      return !removedMockWorkoutIds.has(storedPlan.id ?? '') && !removedMockWorkoutNames.has(storedPlan.name ?? '')
    })

    return plans.flatMap((plan) => {
      try {
        return [mapStoredPlan(plan as WorkoutPlan)]
      } catch {
        return []
      }
    })
  } catch {
    return []
  }
}

function getStoredHistory() {
  try {
    const storedHistory = window.localStorage.getItem(historyStorageKey)
    return storedHistory ? (JSON.parse(storedHistory) as WorkoutHistoryItem[]) : []
  } catch {
    return []
  }
}

function formatTimer(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

function formatDuration(seconds: number) {
  const minutes = Math.max(1, Math.round(seconds / 60))
  if (minutes < 60) return `${minutes} min`

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours}h ${remainingMinutes}min`
}

function createSetState(day: WorkoutDay) {
  return day.exercises.reduce<Record<string, CompletedSet>>((acc, currentExercise) => {
    currentExercise.sets.forEach((set) => {
      acc[set.id] = {
        completed: false,
        load: set.suggestedLoad.replace(' kg', ''),
        reps: '',
        note: '',
      }
    })

    return acc
  }, {})
}

export function WorkoutsPage() {
  const navigate = useNavigate()
  const [savedWorkouts, setSavedWorkouts] = React.useState<SavedWorkout[]>(() =>
    typeof window === 'undefined' ? [] : getStoredWorkouts(),
  )
  const [selectedWorkout, setSelectedWorkout] = React.useState<SavedWorkout | null>(null)
  const [selectedDay, setSelectedDay] = React.useState<WorkoutDay | null>(null)
  const [screen, setScreen] = React.useState<Screen>('list')
  const [setLogs, setSetLogs] = React.useState<Record<string, CompletedSet>>({})
  const [cardioSession, setCardioSession] = React.useState<CardioSession>({ completed: false, time: '', distance: '', note: '' })
  const [summary, setSummary] = React.useState<WorkoutSummaryData | null>(null)
  const [history, setHistory] = React.useState<WorkoutHistoryItem[]>([])
  const [startedAt, setStartedAt] = React.useState<Date | null>(null)

  React.useEffect(() => {
    function loadLocalData() {
      setSavedWorkouts(getStoredWorkouts())
      setHistory(getStoredHistory())
    }

    loadLocalData()
    window.addEventListener('focus', loadLocalData)
    window.addEventListener('workouts-updated', loadLocalData)
    document.addEventListener('visibilitychange', loadLocalData)

    return () => {
      window.removeEventListener('focus', loadLocalData)
      window.removeEventListener('workouts-updated', loadLocalData)
      document.removeEventListener('visibilitychange', loadLocalData)
    }
  }, [])

  function accessWorkout(workout: SavedWorkout) {
    setSelectedWorkout(workout)
    setSelectedDay(workout.days[0] ?? null)
    setScreen('overview')
  }

  function startWorkout() {
    if (!selectedDay) return

    setSetLogs(createSetState(selectedDay))
    setCardioSession({ completed: false, time: '', distance: '', note: '' })
    setStartedAt(new Date())
    setSummary(null)
    setScreen('active')
  }

  function finishWorkout(status: SessionStatus) {
    if (!selectedWorkout || !selectedDay || !startedAt) return

    const durationSeconds = Math.max(60, Math.floor((Date.now() - startedAt.getTime()) / 1000))
    const completedSets = Object.values(setLogs).filter((set) => set.completed).length
    const completedExercises = selectedDay.exercises.filter((workoutExercise) =>
      workoutExercise.sets.some((set) => setLogs[set.id]?.completed),
    ).length
    const totalLoad = selectedDay.exercises.reduce((total, workoutExercise) => {
      return total + workoutExercise.sets.reduce((setTotal, set) => {
        const log = setLogs[set.id]
        const load = Number(String(log?.load ?? '').replace(',', '.'))
        const reps = Number(String(log?.reps ?? '').replace(',', '.'))
        return Number.isFinite(load) && Number.isFinite(reps) ? setTotal + load * reps : setTotal
      }, 0)
    }, 0)

    setSummary({
      date: new Date().toISOString(),
      workoutName: selectedWorkout.name,
      dayFocus: `${selectedDay.weekday} — ${selectedDay.focus}`,
      durationSeconds,
      completedSets,
      completedExercises,
      totalLoad,
      status,
      cardio: selectedDay.cardio ? { ...selectedDay.cardio, ...cardioSession } : undefined,
    })
    setScreen('summary')
  }

  function saveToHistory() {
    if (!summary || !selectedDay) return

    const item: WorkoutHistoryItem = {
      ...summary,
      id: crypto.randomUUID(),
      exercises: selectedDay.exercises.map((workoutExercise) => ({
        name: workoutExercise.name,
        sets: workoutExercise.sets.map((set) => setLogs[set.id]),
      })),
    }
    const nextHistory = [item, ...history]
    setHistory(nextHistory)
    window.localStorage.setItem(historyStorageKey, JSON.stringify(nextHistory))
    toast.success('Treino salvo no histórico')
    void navigate({ to: '/' })
  }

  if (screen === 'overview' && selectedWorkout) {
    return (
      <WorkoutOverview
        selectedDay={selectedDay}
        workout={selectedWorkout}
        onBack={() => setScreen('list')}
        onSelectDay={setSelectedDay}
        onStart={startWorkout}
      />
    )
  }

  if (screen === 'active' && selectedWorkout && selectedDay) {
    return (
      <ActiveWorkoutPage
        cardioSession={cardioSession}
        setLogs={setLogs}
        workout={selectedWorkout}
        workoutDay={selectedDay}
        onCardioChange={setCardioSession}
        onFinish={finishWorkout}
        onSetChange={setSetLogs}
      />
    )
  }

  if (screen === 'summary' && summary) {
    return (
      <WorkoutSummary
        summary={summary}
        onHome={() => void navigate({ to: '/' })}
        onSave={saveToHistory}
      />
    )
  }

  return (
    <AccessWorkoutPage
      historyCount={history.length}
      workouts={savedWorkouts}
      onAccess={accessWorkout}
      onDelete={(id) => setSavedWorkouts((currentWorkouts) => currentWorkouts.filter((workout) => workout.id !== id))}
    />
  )
}

function AccessWorkoutPage({
  historyCount,
  workouts,
  onAccess,
  onDelete,
}: {
  historyCount: number
  workouts: SavedWorkout[]
  onAccess: (workout: SavedWorkout) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-5">
      <section className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Acessar treino</p>
          <h2 className="text-2xl font-semibold tracking-tight">Escolha o treino de hoje</h2>
        </div>
        <div className="rounded-md border border-border bg-card px-3 py-2 text-right">
          <p className="text-xs text-muted-foreground">Histórico</p>
          <p className="text-sm font-semibold">{historyCount} salvos</p>
        </div>
      </section>

      {workouts.length === 0 ? (
        <EmptyWorkoutState />
      ) : (
        <section className="grid gap-4 lg:grid-cols-2">
          {workouts.map((workout) => (
            <SavedWorkoutCard
              key={workout.id}
              workout={workout}
              onAccess={() => onAccess(workout)}
              onDelete={() => onDelete(workout.id)}
            />
          ))}
        </section>
      )}
    </div>
  )
}

function SavedWorkoutCard({
  workout,
  onAccess,
  onDelete,
}: {
  workout: SavedWorkout
  onAccess: () => void
  onDelete: () => void
}) {
  const exerciseCount = workout.days.reduce((total, day) => total + day.exercises.length, 0)

  return (
    <article className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold">{workout.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {workout.methodology} • {workout.split}
          </p>
        </div>
        <Dumbbell className="size-5 shrink-0 text-primary" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <InfoPill icon={CalendarDays} label="Dias" value={workout.weekdays.join(', ')} />
        <InfoPill icon={Activity} label="Exercícios" value={`${exerciseCount}`} />
        <InfoPill icon={History} label="Último acesso" value={workout.lastAccessed ?? 'Nunca realizado'} className="col-span-2" />
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto_auto] gap-2">
        <Button className="h-12 text-base" type="button" onClick={onAccess}>
          <Play className="size-4" />
          Acessar
        </Button>
        <Button aria-label="Editar treino" className="h-12" type="button" variant="outline" onClick={() => toast.info('Edição entra na próxima etapa.')}>
          <Edit3 className="size-4" />
        </Button>
        <Button aria-label="Excluir treino" className="h-12" type="button" variant="outline" onClick={onDelete}>
          <Trash2 className="size-4" />
        </Button>
      </div>
    </article>
  )
}

function EmptyWorkoutState() {
  return (
    <section className="rounded-lg border border-dashed border-border bg-card p-8 text-center">
      <Dumbbell className="mx-auto size-8 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">Nenhum treino criado ainda.</h3>
      <Button asChild className="mt-5 h-12 text-base">
        <Link to="/create-workout">
          <Plus className="size-4" />
          Criar meu primeiro treino
        </Link>
      </Button>
    </section>
  )
}

function WorkoutOverview({
  selectedDay,
  workout,
  onBack,
  onSelectDay,
  onStart,
}: {
  selectedDay: WorkoutDay | null
  workout: SavedWorkout
  onBack: () => void
  onSelectDay: (day: WorkoutDay) => void
  onStart: () => void
}) {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-5">
      <Button type="button" variant="ghost" onClick={onBack}>
        <ArrowLeft className="size-4" />
        Treinos salvos
      </Button>

      <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <p className="text-sm font-medium text-muted-foreground">Visão geral</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">{workout.name}</h2>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <InfoPill icon={Flame} label="Metodologia" value={workout.methodology} />
          <InfoPill icon={RotateCcw} label="Divisão" value={workout.split} />
          <InfoPill icon={CalendarDays} label="Dias" value={workout.weekdays.join(', ')} />
        </div>
      </section>

      <WorkoutDaySelector selectedDay={selectedDay} workout={workout} onSelectDay={onSelectDay} />

      {selectedDay && (
        <section className="space-y-3 rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Exercícios de hoje</p>
              <h3 className="text-xl font-semibold">{selectedDay.focus}</h3>
            </div>
            <Button className="h-12 px-5 text-base" type="button" onClick={onStart}>
              <Play className="size-4" />
              Iniciar treino
            </Button>
          </div>

          {selectedDay.exercises.length === 0 ? (
            <p className="rounded-md bg-secondary p-3 text-sm text-muted-foreground">Dia focado em cardio ou descanso ativo.</p>
          ) : (
            <div className="grid gap-2">
              {selectedDay.exercises.map((workoutExercise) => (
                <div key={workoutExercise.id} className="rounded-md border border-border p-3">
                  <p className="font-medium">{workoutExercise.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {workoutExercise.plannedSets} séries • {workoutExercise.targetReps} reps • descanso {formatTimer(workoutExercise.plannedRestSeconds)}
                  </p>
                </div>
              ))}
            </div>
          )}

          {selectedDay.cardio && <CardioPlanCard cardio={selectedDay.cardio} />}
        </section>
      )}
    </div>
  )
}

function WorkoutDaySelector({
  selectedDay,
  workout,
  onSelectDay,
}: {
  selectedDay: WorkoutDay | null
  workout: SavedWorkout
  onSelectDay: (day: WorkoutDay) => void
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-lg font-semibold">Dias disponíveis</h3>
      <div className="grid gap-3 md:grid-cols-2">
        {workout.days.map((day) => (
          <button
            key={day.id}
            className={cn(
              'rounded-lg border border-border bg-card p-4 text-left shadow-sm transition-colors hover:border-primary/60',
              selectedDay?.id === day.id && 'border-primary ring-2 ring-primary/20',
            )}
            type="button"
            onClick={() => onSelectDay(day)}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{day.weekday}</p>
                <p className="text-lg font-semibold">{day.focus}</p>
              </div>
              {day.cardio && <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium">Cardio</span>}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{day.muscleGroups.join(', ')}</p>
            <p className="mt-2 text-sm font-medium">
              {day.exercises.length} exercícios{day.cardio ? ` • ${day.cardio.type} ${day.cardio.duration}` : ''}
            </p>
          </button>
        ))}
      </div>
    </section>
  )
}

function ActiveWorkoutPage({
  cardioSession,
  setLogs,
  workout,
  workoutDay,
  onCardioChange,
  onFinish,
  onSetChange,
}: {
  cardioSession: CardioSession
  setLogs: Record<string, CompletedSet>
  workout: SavedWorkout
  workoutDay: WorkoutDay
  onCardioChange: (session: CardioSession) => void
  onFinish: (status: SessionStatus) => void
  onSetChange: React.Dispatch<React.SetStateAction<Record<string, CompletedSet>>>
}) {
  const [finishOpen, setFinishOpen] = React.useState(false)
  const [restTimer, setRestTimer] = React.useState({ secondsLeft: 0, running: false })
  const totalSets = workoutDay.exercises.reduce((total, workoutExercise) => total + workoutExercise.sets.length, 0)
  const completedSets = Object.values(setLogs).filter((set) => set.completed).length
  const allDone = totalSets > 0 && completedSets === totalSets

  React.useEffect(() => {
    if (!restTimer.running || restTimer.secondsLeft <= 0) return undefined

    const intervalId = window.setInterval(() => {
      setRestTimer((currentTimer) => {
        if (!currentTimer.running) return currentTimer
        if (currentTimer.secondsLeft <= 1) {
          window.clearInterval(intervalId)
          toast.success('Descanso finalizado. Próxima série!')
          return { secondsLeft: 0, running: false }
        }

        return { ...currentTimer, secondsLeft: currentTimer.secondsLeft - 1 }
      })
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [restTimer.running, restTimer.secondsLeft])

  function updateSet(setId: string, patch: Partial<CompletedSet>) {
    onSetChange((currentLogs) => ({
      ...currentLogs,
      [setId]: {
        ...currentLogs[setId],
        ...patch,
      },
    }))
  }

  function completeSet(set: WorkoutSet) {
    updateSet(set.id, { completed: true })
    setRestTimer({ secondsLeft: set.restSeconds, running: true })
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4 pb-28">
      <section className="sticky top-16 z-10 -mx-4 border-b border-border bg-background/95 px-4 py-3 backdrop-blur md:top-16 md:mx-0 md:rounded-lg md:border">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-muted-foreground">{workout.name}</p>
            <h2 className="text-xl font-semibold tracking-tight">{workoutDay.weekday} — {workoutDay.focus}</h2>
          </div>
          <Button className="h-11 shrink-0" type="button" variant="outline" onClick={() => setFinishOpen(true)}>
            <X className="size-4" />
            Encerrar
          </Button>
        </div>

        <div className="mt-3">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{completedSets}/{totalSets} séries concluídas</span>
            <span className="text-muted-foreground">{Math.round((completedSets / Math.max(totalSets, 1)) * 100)}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(completedSets / Math.max(totalSets, 1)) * 100}%` }} />
          </div>
        </div>
      </section>

      {restTimer.secondsLeft > 0 && (
        <RestTimer
          running={restTimer.running}
          secondsLeft={restTimer.secondsLeft}
          onAdd={() => setRestTimer((timer) => ({ ...timer, secondsLeft: timer.secondsLeft + 30 }))}
          onPause={() => setRestTimer((timer) => ({ ...timer, running: false }))}
          onResume={() => setRestTimer((timer) => ({ ...timer, running: true }))}
          onSkip={() => setRestTimer({ secondsLeft: 0, running: false })}
        />
      )}

      {workoutDay.cardio && (
        <CardioExecutionCard
          cardio={workoutDay.cardio}
          session={cardioSession}
          onChange={onCardioChange}
        />
      )}

      {workoutDay.exercises.map((workoutExercise) => (
        <ExerciseExecutionCard
          key={workoutExercise.id}
          exercise={workoutExercise}
          logs={setLogs}
          onCompleteSet={completeSet}
          onUpdateSet={updateSet}
        />
      ))}

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 p-4 backdrop-blur md:left-64">
        <div className="mx-auto flex max-w-4xl gap-3">
          <Button className="h-12 flex-1 text-base" type="button" variant="outline" onClick={() => setFinishOpen(true)}>
            Finalizar treino
          </Button>
          <Button className="h-12 flex-1 text-base" disabled={!allDone} type="button" onClick={() => onFinish('concluído')}>
            <Check className="size-4" />
            Concluir
          </Button>
        </div>
      </div>

      <FinishWorkoutModal
        open={finishOpen}
        onCancel={() => setFinishOpen(false)}
        onFinish={() => onFinish(allDone ? 'concluído' : 'encerrado antes do fim')}
      />
    </div>
  )
}

function ExerciseExecutionCard({
  exercise,
  logs,
  onCompleteSet,
  onUpdateSet,
}: {
  exercise: WorkoutExercise
  logs: Record<string, CompletedSet>
  onCompleteSet: (set: WorkoutSet) => void
  onUpdateSet: (setId: string, patch: Partial<CompletedSet>) => void
}) {
  const exerciseLogs = exercise.sets.map((set) => logs[set.id])
  const completedSets = exerciseLogs.filter((log) => log?.completed).length
  const totalReps = exerciseLogs.reduce((total, log) => total + Number(log?.reps || 0), 0)
  const bestLoad = Math.max(0, ...exerciseLogs.map((log) => Number(String(log?.load ?? '').replace(',', '.')) || 0))

  return (
    <article className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">{exercise.name}</h3>
            <p className="text-sm text-muted-foreground">
              {exercise.muscleGroup}{exercise.subgroup ? ` • ${exercise.subgroup}` : ''} • {exercise.equipment}
            </p>
          </div>
          <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium">{completedSets}/{exercise.sets.length}</span>
        </div>
        <p className="text-sm text-muted-foreground">{exercise.note}</p>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <Metric label="Séries" value={`${exercise.plannedSets}`} />
          <Metric label="Reps" value={exercise.targetReps} />
          <Metric label="Descanso" value={formatTimer(exercise.plannedRestSeconds)} />
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {exercise.sets.map((set) => (
          <WorkoutSetRow
            key={set.id}
            log={logs[set.id]}
            set={set}
            onComplete={() => onCompleteSet(set)}
            onUpdate={(patch) => onUpdateSet(set.id, patch)}
          />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
        <Metric label="Melhor carga" value={bestLoad > 0 ? `${bestLoad} kg` : '-'} />
        <Metric label="Reps feitas" value={`${totalReps}`} />
        <Metric label="Séries feitas" value={`${completedSets}`} />
      </div>
    </article>
  )
}

function WorkoutSetRow({
  log,
  set,
  onComplete,
  onUpdate,
}: {
  log: CompletedSet
  set: WorkoutSet
  onComplete: () => void
  onUpdate: (patch: Partial<CompletedSet>) => void
}) {
  return (
    <div className={cn('rounded-md border border-border p-3', log?.completed && 'border-primary/50 bg-primary/5')}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-medium">Série {set.number} — {set.type}</p>
          <p className="text-sm text-muted-foreground">{set.targetReps} reps • {set.suggestedLoad}</p>
        </div>
        <Button className="h-11 shrink-0" disabled={log?.completed} type="button" onClick={onComplete}>
          <Check className="size-4" />
          {log?.completed ? 'Feita' : 'Concluir'}
        </Button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Input inputMode="decimal" placeholder="Carga kg" value={log?.load ?? ''} onChange={(event) => onUpdate({ load: event.target.value })} />
        <Input inputMode="numeric" placeholder="Reps feitas" value={log?.reps ?? ''} onChange={(event) => onUpdate({ reps: event.target.value })} />
      </div>
      <Input className="mt-2" placeholder="Observação opcional" value={log?.note ?? ''} onChange={(event) => onUpdate({ note: event.target.value })} />
    </div>
  )
}

function RestTimer({
  running,
  secondsLeft,
  onAdd,
  onPause,
  onResume,
  onSkip,
}: {
  running: boolean
  secondsLeft: number
  onAdd: () => void
  onPause: () => void
  onResume: () => void
  onSkip: () => void
}) {
  return (
    <section className="rounded-lg border border-primary/30 bg-primary/10 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Descanso</p>
          <p className="text-3xl font-semibold tabular-nums">{formatTimer(secondsLeft)}</p>
        </div>
        <Clock className="size-7 text-primary" />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <Button className="h-11" type="button" variant="outline" onClick={running ? onPause : onResume}>
          {running ? <Pause className="size-4" /> : <Play className="size-4" />}
          {running ? 'Pausar' : 'Continuar'}
        </Button>
        <Button className="h-11" type="button" variant="outline" onClick={onAdd}>
          +30s
        </Button>
        <Button className="h-11" type="button" variant="outline" onClick={onSkip}>
          <SkipForward className="size-4" />
          Pular
        </Button>
      </div>
    </section>
  )
}

function CardioPlanCard({ cardio }: { cardio: CardioPlan }) {
  return (
    <div className="rounded-md border border-border p-3">
      <p className="font-medium">Cardio</p>
      <p className="text-sm text-muted-foreground">
        {cardio.type} • {cardio.duration} • {cardio.intensity} • {cardio.timing}
      </p>
    </div>
  )
}

function CardioExecutionCard({
  cardio,
  session,
  onChange,
}: {
  cardio: CardioPlan
  session: CardioSession
  onChange: (session: CardioSession) => void
}) {
  return (
    <article className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Cardio</p>
          <h3 className="text-lg font-semibold">{cardio.type}</h3>
          <p className="text-sm text-muted-foreground">{cardio.duration} • {cardio.intensity} • {cardio.timing}</p>
        </div>
        <Button className="h-11" type="button" variant={session.completed ? 'secondary' : 'default'} onClick={() => onChange({ ...session, completed: !session.completed })}>
          <Check className="size-4" />
          {session.completed ? 'Feito' : 'Concluir'}
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Input placeholder="Tempo feito" value={session.time} onChange={(event) => onChange({ ...session, time: event.target.value })} />
        <Input placeholder="Distância" value={session.distance} onChange={(event) => onChange({ ...session, distance: event.target.value })} />
      </div>
      <Input className="mt-2" placeholder="Observação opcional" value={session.note} onChange={(event) => onChange({ ...session, note: event.target.value })} />
    </article>
  )
}

function FinishWorkoutModal({
  open,
  onCancel,
  onFinish,
}: {
  open: boolean
  onCancel: () => void
  onFinish: () => void
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-5 shadow-lg">
        <h3 className="text-lg font-semibold">Deseja finalizar este treino?</h3>
        <p className="mt-2 text-sm text-muted-foreground">O resumo será gerado com as séries e cargas registradas até agora.</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button className="h-12" type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button className="h-12" type="button" onClick={onFinish}>
            Finalizar
          </Button>
        </div>
      </div>
    </div>
  )
}

function WorkoutSummary({
  summary,
  onHome,
  onSave,
}: {
  summary: WorkoutSummaryData
  onHome: () => void
  onSave: () => void
}) {
  return (
    <div className="mx-auto w-full max-w-lg space-y-4">
      <section className="rounded-lg border border-border bg-card p-5 text-center shadow-sm">
        <Check className="mx-auto size-10 rounded-full bg-primary p-2 text-primary-foreground" />
        <h2 className="mt-4 text-2xl font-semibold tracking-tight">Treino concluído</h2>
        <p className="mt-1 text-sm text-muted-foreground">{summary.workoutName} • {summary.dayFocus}</p>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <Metric label="Duração" value={formatDuration(summary.durationSeconds)} />
        <Metric label="Status" value={summary.status} />
        <Metric label="Séries" value={`${summary.completedSets}`} />
        <Metric label="Exercícios" value={`${summary.completedExercises}`} />
        <Metric label="Carga total" value={summary.totalLoad > 0 ? `${Math.round(summary.totalLoad)} kg` : '-'} className="col-span-2" />
      </section>

      {summary.cardio && (
        <section className="rounded-lg border border-border bg-card p-4">
          <p className="font-semibold">Cardio realizado</p>
          <p className="text-sm text-muted-foreground">
            {summary.cardio.completed ? 'Concluído' : 'Não marcado'} • {summary.cardio.time || summary.cardio.duration}
            {summary.cardio.distance ? ` • ${summary.cardio.distance}` : ''}
          </p>
        </section>
      )}

      <div className="grid gap-3">
        <Button className="h-12 text-base" type="button" onClick={onSave}>
          <Save className="size-4" />
          Salvar no histórico
        </Button>
        <Button className="h-12 text-base" type="button" variant="outline" onClick={onHome}>
          Voltar para Home
        </Button>
      </div>
    </div>
  )
}

function InfoPill({
  className,
  icon: Icon,
  label,
  value,
}: {
  className?: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className={cn('rounded-md bg-secondary p-3', className)}>
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </div>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  )
}

function Metric({ className, label, value }: { className?: string; label: string; value: string }) {
  return (
    <div className={cn('rounded-md border border-border bg-card p-3', className)}>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  )
}
