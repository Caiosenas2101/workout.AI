import * as React from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Dumbbell,
  HeartPulse,
  Plus,
  Save,
  Search,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

import {
  cardioDurations,
  cardioIntensities,
  cardioModes,
  cardioTimings,
  cardioTypes,
  defaultCardioConfig,
  exerciseDatabase,
  focusMuscleMap,
  getSuggestedSplitIds,
  getVolumeDefaults,
  muscleGroups,
  weekDays,
  workoutFocusOptions,
  workoutMethods,
  workoutSplits,
} from './workout-builder-data'
import type {
  CardioConfig,
  Exercise,
  SelectedExercise,
  WeekDayId,
  WorkoutDay,
  WorkoutMethodId,
  WorkoutPlan,
  WorkoutSplitId,
} from './workout-builder-types'

const steps = [
  'Dias',
  'Metodologia',
  'Divisão',
  'Treinos',
  'Cardio',
  'Exercícios',
  'Revisão',
] as const

const muscleNameById = new Map(muscleGroups.map((group) => [group.id, group.name]))

function createDefaultWorkoutDay(dayId: WeekDayId, index: number): WorkoutDay {
  const suggestedFocus = ['Push', 'Pull', 'Legs', 'Upper', 'Lower', 'Full Body', 'Descanso ativo'][index] ?? 'Personalizado'

  return {
    dayId,
    focus: suggestedFocus,
    muscleGroups: focusMuscleMap[suggestedFocus] ?? [],
    exercises: [],
  }
}

function getStoredPlans() {
  try {
    const storedPlans = window.localStorage.getItem('workout-ai-workouts')
    return storedPlans ? (JSON.parse(storedPlans) as WorkoutPlan[]) : []
  } catch {
    return []
  }
}

export function CreateWorkoutPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = React.useState(0)
  const [workoutName, setWorkoutName] = React.useState('Meu treino')
  const [selectedDays, setSelectedDays] = React.useState<WeekDayId[]>(['mon', 'wed', 'fri'])
  const [method, setMethod] = React.useState<WorkoutMethodId>('low-volume')
  const [split, setSplit] = React.useState<WorkoutSplitId>('abc')
  const [cardio, setCardio] = React.useState<CardioConfig>(defaultCardioConfig)
  const [workoutDays, setWorkoutDays] = React.useState<WorkoutDay[]>([
    createDefaultWorkoutDay('mon', 0),
    createDefaultWorkoutDay('wed', 1),
    createDefaultWorkoutDay('fri', 2),
  ])

  React.useEffect(() => {
    setWorkoutDays((currentDays) =>
      selectedDays.map((dayId, index) => currentDays.find((day) => day.dayId === dayId) ?? createDefaultWorkoutDay(dayId, index)),
    )

    const suggestedIds = getSuggestedSplitIds(selectedDays.length)
    if (suggestedIds.length > 0 && !suggestedIds.includes(split)) {
      setSplit(suggestedIds[0])
    }
  }, [selectedDays, split])

  const totalExercises = workoutDays.reduce((total, day) => total + day.exercises.length, 0)
  const selectedMethod = workoutMethods.find((item) => item.id === method) ?? workoutMethods[0]
  const selectedSplit = workoutSplits.find((item) => item.id === split) ?? workoutSplits[0]
  const canAdvance =
    (currentStep !== 0 || selectedDays.length > 0) &&
    (currentStep !== 5 || totalExercises > 0)

  function goNext() {
    if (!canAdvance) {
      toast.error(currentStep === 5 ? 'Adicione pelo menos um exercício.' : 'Selecione pelo menos um dia.')
      return
    }

    setCurrentStep((step) => Math.min(step + 1, steps.length - 1))
  }

  function saveWorkout() {
    const plan: WorkoutPlan = {
      id: crypto.randomUUID(),
      name: workoutName.trim() || 'Meu treino',
      days: selectedDays,
      method,
      split,
      cardio,
      workoutDays,
      createdAt: new Date().toISOString(),
    }

    window.localStorage.setItem('workout-ai-workouts', JSON.stringify([plan, ...getStoredPlans()]))
    toast.success('Treino criado com sucesso')
    void navigate({ to: '/workouts' })
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5">
      <section className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Criar treino</p>
            <h2 className="text-2xl font-semibold tracking-tight">Monte sua rotina semanal</h2>
          </div>
          <div className="rounded-md border border-border bg-card px-3 py-2 text-right">
            <p className="text-xs text-muted-foreground">Etapa</p>
            <p className="text-sm font-semibold">
              {currentStep + 1}/{steps.length}
            </p>
          </div>
        </div>

        <StepProgress currentStep={currentStep} />
      </section>

      <section className="rounded-lg border border-border bg-card p-4 shadow-sm md:p-5">
        {currentStep === 0 && <WeekDaySelector selectedDays={selectedDays} onChange={setSelectedDays} />}
        {currentStep === 1 && <TrainingMethodSelector method={method} onChange={setMethod} />}
        {currentStep === 2 && <SplitSelector dayCount={selectedDays.length} split={split} onChange={setSplit} />}
        {currentStep === 3 && <DayWorkoutBuilder workoutDays={workoutDays} onChange={setWorkoutDays} />}
        {currentStep === 4 && <CardioSelector cardio={cardio} onChange={setCardio} method={method} />}
        {currentStep === 5 && (
          <ExercisePicker
            method={method}
            selectedDays={selectedDays}
            workoutDays={workoutDays}
            onChange={setWorkoutDays}
          />
        )}
        {currentStep === 6 && (
          <WorkoutReview
            cardio={cardio}
            methodName={selectedMethod.name}
            splitName={selectedSplit.name}
            workoutDays={workoutDays}
            workoutName={workoutName}
            selectedDays={selectedDays}
            onNameChange={setWorkoutName}
          />
        )}
      </section>

      <div className="sticky bottom-0 -mx-4 border-t border-border bg-background/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:p-0">
        <div className="mx-auto flex max-w-5xl gap-3">
          <Button
            className="h-12 flex-1"
            disabled={currentStep === 0}
            type="button"
            variant="outline"
            onClick={() => setCurrentStep((step) => Math.max(step - 1, 0))}
          >
            <ArrowLeft className="size-4" />
            Voltar
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button className="h-12 flex-1" type="button" onClick={saveWorkout}>
              <Save className="size-4" />
              Salvar treino
            </Button>
          ) : (
            <Button className="h-12 flex-1" type="button" onClick={goNext}>
              Continuar
              <ArrowRight className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function StepProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="overflow-x-auto pb-1">
      <div className="grid min-w-[680px] grid-cols-7 gap-2">
        {steps.map((step, index) => (
          <div key={step} className="space-y-2">
            <div
              className={cn(
                'h-1.5 rounded-full bg-secondary',
                index <= currentStep && 'bg-primary',
              )}
            />
            <p className={cn('text-xs font-medium text-muted-foreground', index === currentStep && 'text-foreground')}>
              {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function WeekDaySelector({
  selectedDays,
  onChange,
}: {
  selectedDays: WeekDayId[]
  onChange: (days: WeekDayId[]) => void
}) {
  function toggleDay(dayId: WeekDayId) {
    if (selectedDays.includes(dayId)) {
      onChange(selectedDays.filter((selectedDay) => selectedDay !== dayId))
      return
    }

    const orderedDays = weekDays
      .map((day) => day.id)
      .filter((id) => [...selectedDays, dayId].includes(id))
    onChange(orderedDays)
  }

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Escolha os dias da semana"
        description="Selecione de 1 a 7 dias. A divisão será sugerida a partir dessa escolha."
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {weekDays.map((day) => {
          const selected = selectedDays.includes(day.id)

          return (
            <button
              key={day.id}
              className={cn(
                'min-h-24 rounded-lg border border-border bg-background p-3 text-left transition-colors',
                selected && 'border-primary bg-primary text-primary-foreground',
              )}
              type="button"
              onClick={() => toggleDay(day.id)}
            >
              <span className="text-xl font-semibold">{day.shortLabel}</span>
              <span className={cn('mt-2 block text-sm text-muted-foreground', selected && 'text-primary-foreground/80')}>
                {day.label}
              </span>
              {selected && <Check className="mt-3 size-5" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function TrainingMethodSelector({
  method,
  onChange,
}: {
  method: WorkoutMethodId
  onChange: (method: WorkoutMethodId) => void
}) {
  return (
    <div className="space-y-5">
      <SectionHeader
        title="Escolha a metodologia"
        description="Ela ajusta sugestões de volume, exercícios, descanso e cardio."
      />

      <div className="grid gap-3 md:grid-cols-3">
        {workoutMethods.map((item) => (
          <button
            key={item.id}
            className={cn(
              'rounded-lg border border-border bg-background p-4 text-left transition-colors',
              method === item.id && 'border-primary bg-secondary',
            )}
            type="button"
            onClick={() => onChange(item.id)}
          >
            <div className="flex items-center gap-2">
              <Dumbbell className="size-5" />
              <p className="font-semibold">{item.name}</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
            <p className="mt-4 rounded-md bg-muted px-3 py-2 text-xs font-medium text-muted-foreground">
              {item.volumeHint}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}

function SplitSelector({
  dayCount,
  split,
  onChange,
}: {
  dayCount: number
  split: WorkoutSplitId
  onChange: (split: WorkoutSplitId) => void
}) {
  const suggestedIds = getSuggestedSplitIds(dayCount)

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Defina a divisão semanal"
        description="A divisão organiza os focos dos dias. Você ainda poderá ajustar tudo manualmente."
      />

      <div className="rounded-lg border border-border bg-background p-3">
        <p className="text-sm font-semibold">Sugestão para {dayCount} dia(s)</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {workoutSplits
            .filter((item) => suggestedIds.includes(item.id))
            .map((item) => item.name)
            .join(', ') || 'Selecione os dias para ver sugestões.'}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {workoutSplits.map((item) => (
          <button
            key={item.id}
            className={cn(
              'rounded-lg border border-border bg-background p-4 text-left transition-colors',
              split === item.id && 'border-primary bg-secondary',
            )}
            type="button"
            onClick={() => onChange(item.id)}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold">{item.name}</p>
              {suggestedIds.includes(item.id) && (
                <span className="rounded-md bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
                  sugerido
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

function DayWorkoutBuilder({
  workoutDays,
  onChange,
}: {
  workoutDays: WorkoutDay[]
  onChange: (days: WorkoutDay[]) => void
}) {
  function updateDay(dayId: WeekDayId, changes: Partial<WorkoutDay>) {
    onChange(workoutDays.map((day) => (day.dayId === dayId ? { ...day, ...changes } : day)))
  }

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Configure cada dia"
        description="Escolha o foco do treino e ajuste manualmente os grupos musculares."
      />

      <div className="space-y-4">
        {workoutDays.map((day) => (
          <article key={day.dayId} className="rounded-lg border border-border bg-background p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Dia de treino</p>
                <h3 className="text-lg font-semibold">{weekDays.find((item) => item.id === day.dayId)?.label}</h3>
              </div>
              <select
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={day.focus}
                onChange={(event) => {
                  const focus = event.target.value
                  updateDay(day.dayId, {
                    focus,
                    muscleGroups: focus === 'Personalizado' ? day.muscleGroups : focusMuscleMap[focus] ?? [],
                  })
                }}
              >
                {workoutFocusOptions.map((focus) => (
                  <option key={focus} value={focus}>
                    {focus}
                  </option>
                ))}
              </select>
            </div>

            <MuscleGroupSelector
              selectedGroups={day.muscleGroups}
              onChange={(muscleGroupIds) => updateDay(day.dayId, { muscleGroups: muscleGroupIds })}
            />
          </article>
        ))}
      </div>
    </div>
  )
}

function MuscleGroupSelector({
  selectedGroups,
  onChange,
}: {
  selectedGroups: string[]
  onChange: (groups: string[]) => void
}) {
  const categories = ['Superiores', 'Inferiores', 'Cardio'] as const

  function toggleGroup(groupId: string) {
    onChange(
      selectedGroups.includes(groupId)
        ? selectedGroups.filter((selectedGroup) => selectedGroup !== groupId)
        : [...selectedGroups, groupId],
    )
  }

  return (
    <div className="mt-4 space-y-4">
      {categories.map((category) => (
        <div key={category} className="space-y-2">
          <p className="text-xs font-semibold uppercase text-muted-foreground">{category}</p>
          <div className="flex flex-wrap gap-2">
            {muscleGroups
              .filter((group) => group.category === category)
              .map((group) => {
                const selected = selectedGroups.includes(group.id)

                return (
                  <button
                    key={group.id}
                    className={cn(
                      'min-h-10 rounded-md border border-border px-3 text-sm font-medium transition-colors',
                      selected ? 'border-primary bg-primary text-primary-foreground' : 'bg-card',
                    )}
                    type="button"
                    onClick={() => toggleGroup(group.id)}
                  >
                    {group.name}
                  </button>
                )
              })}
          </div>
        </div>
      ))}
    </div>
  )
}

function CardioSelector({
  cardio,
  method,
  onChange,
}: {
  cardio: CardioConfig
  method: WorkoutMethodId
  onChange: (cardio: CardioConfig) => void
}) {
  return (
    <div className="space-y-5">
      <SectionHeader
        title="Escolha o cardio"
        description="Configure o cardio nos dias de treino, descanso ou de forma personalizada."
      />

      {method === 'hybrid' && (
        <div className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
          Metodologia híbrida selecionada: o app sugere cardio leve ou moderado sem inflar o volume da musculação.
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {cardioModes.map((mode) => (
          <button
            key={mode}
            className={cn(
              'rounded-lg border border-border bg-background p-4 text-left font-medium transition-colors',
              cardio.mode === mode && 'border-primary bg-secondary',
            )}
            type="button"
            onClick={() => onChange({ ...cardio, mode })}
          >
            <HeartPulse className="mb-3 size-5" />
            {mode}
          </button>
        ))}
      </div>

      {cardio.mode !== 'Sem cardio' && (
        <div className="grid gap-3 rounded-lg border border-border bg-background p-4 md:grid-cols-2">
          <SelectField label="Tipo" value={cardio.type} options={cardioTypes} onChange={(type) => onChange({ ...cardio, type })} />
          <SelectField label="Intensidade" value={cardio.intensity} options={cardioIntensities} onChange={(intensity) => onChange({ ...cardio, intensity })} />
          <SelectField label="Duração" value={cardio.duration} options={cardioDurations} onChange={(duration) => onChange({ ...cardio, duration })} />
          <SelectField label="Momento" value={cardio.timing} options={cardioTimings} onChange={(timing) => onChange({ ...cardio, timing })} />
          {cardio.duration === 'Personalizado' && (
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium">Duração personalizada</span>
              <Input
                placeholder="Ex.: 25 min"
                value={cardio.customDuration}
                onChange={(event) => onChange({ ...cardio, customDuration: event.target.value })}
              />
            </label>
          )}
        </div>
      )}
    </div>
  )
}

function ExercisePicker({
  method,
  selectedDays,
  workoutDays,
  onChange,
}: {
  method: WorkoutMethodId
  selectedDays: WeekDayId[]
  workoutDays: WorkoutDay[]
  onChange: (days: WorkoutDay[]) => void
}) {
  const [activeDayId, setActiveDayId] = React.useState<WeekDayId>(selectedDays[0] ?? 'mon')
  const [query, setQuery] = React.useState('')
  const [groupFilter, setGroupFilter] = React.useState('Todos')
  const [subgroupFilter, setSubgroupFilter] = React.useState('Todos')
  const [equipmentFilter, setEquipmentFilter] = React.useState('Todos')
  const activeDay = workoutDays.find((day) => day.dayId === activeDayId) ?? workoutDays[0]
  const defaults = getVolumeDefaults(method)

  React.useEffect(() => {
    if (!selectedDays.includes(activeDayId) && selectedDays[0]) {
      setActiveDayId(selectedDays[0])
    }
  }, [activeDayId, selectedDays])

  const dayMuscleNames = new Set(activeDay?.muscleGroups.map((id) => muscleNameById.get(id)).filter(Boolean))
  const groups = [...new Set(exerciseDatabase.map((exercise) => exercise.muscleGroup))].sort()
  const subgroups = [...new Set(exerciseDatabase.map((exercise) => exercise.subgroup))].sort()
  const equipment = [...new Set(exerciseDatabase.flatMap((exercise) => exercise.equipment))].sort()

  const filteredExercises = exerciseDatabase.filter((exercise) => {
    const matchesQuery = exercise.name.toLowerCase().includes(query.toLowerCase())
    const matchesGroup = groupFilter === 'Todos' || exercise.muscleGroup === groupFilter
    const matchesSubgroup = subgroupFilter === 'Todos' || exercise.subgroup === subgroupFilter
    const matchesEquipment = equipmentFilter === 'Todos' || exercise.equipment.includes(equipmentFilter)
    const matchesDay = dayMuscleNames.size === 0 || dayMuscleNames.has(exercise.muscleGroup)

    return matchesQuery && matchesGroup && matchesSubgroup && matchesEquipment && matchesDay
  })

  function updateActiveDay(changes: Partial<WorkoutDay>) {
    onChange(workoutDays.map((day) => (day.dayId === activeDay.dayId ? { ...day, ...changes } : day)))
  }

  function addExercise(exercise: Exercise) {
    const selectedExercise: SelectedExercise = {
      ...exercise,
      selectedId: crypto.randomUUID(),
      ...defaults,
    }

    updateActiveDay({ exercises: [...activeDay.exercises, selectedExercise] })
  }

  function updateExercise(selectedId: string, changes: Partial<SelectedExercise>) {
    updateActiveDay({
      exercises: activeDay.exercises.map((exercise) =>
        exercise.selectedId === selectedId ? { ...exercise, ...changes } : exercise,
      ),
    })
  }

  function removeExercise(selectedId: string) {
    updateActiveDay({ exercises: activeDay.exercises.filter((exercise) => exercise.selectedId !== selectedId) })
  }

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Escolha os exercícios"
        description="Use os filtros para adicionar exercícios ao dia selecionado e ajuste volume depois."
      />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {workoutDays.map((day) => (
          <button
            key={day.dayId}
            className={cn(
              'h-11 shrink-0 rounded-md border border-border px-4 text-sm font-semibold',
              activeDayId === day.dayId ? 'border-primary bg-primary text-primary-foreground' : 'bg-background',
            )}
            type="button"
            onClick={() => setActiveDayId(day.dayId)}
          >
            {weekDays.find((item) => item.id === day.dayId)?.shortLabel} · {day.exercises.length}
          </button>
        ))}
      </div>

      <SelectedExerciseList exercises={activeDay.exercises} onRemove={removeExercise} onUpdate={updateExercise} />

      <div className="grid gap-3 rounded-lg border border-border bg-background p-3 lg:grid-cols-[1fr_180px_180px_180px]">
        <label className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Buscar exercício"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <SelectField label="Grupo" value={groupFilter} options={['Todos', ...groups]} onChange={setGroupFilter} compact />
        <SelectField label="Subgrupo" value={subgroupFilter} options={['Todos', ...subgroups]} onChange={setSubgroupFilter} compact />
        <SelectField label="Equipamento" value={equipmentFilter} options={['Todos', ...equipment]} onChange={setEquipmentFilter} compact />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {filteredExercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} onAdd={addExercise} />
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="rounded-lg border border-border bg-background p-6 text-center text-sm text-muted-foreground">
          Nenhum exercício encontrado com esses filtros.
        </div>
      )}
    </div>
  )
}

function ExerciseCard({ exercise, onAdd }: { exercise: Exercise; onAdd: (exercise: Exercise) => void }) {
  return (
    <article className="rounded-lg border border-border bg-background p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{exercise.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {exercise.muscleGroup} · {exercise.subgroup}
          </p>
        </div>
        <Button size="sm" type="button" onClick={() => onAdd(exercise)}>
          <Plus className="size-4" />
          Adicionar
        </Button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {exercise.equipment.map((item) => (
          <span key={item} className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
            {item}
          </span>
        ))}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        {exercise.variations.slice(0, 3).join(' · ')}
      </p>
    </article>
  )
}

function SelectedExerciseList({
  exercises,
  onRemove,
  onUpdate,
}: {
  exercises: SelectedExercise[]
  onRemove: (selectedId: string) => void
  onUpdate: (selectedId: string, changes: Partial<SelectedExercise>) => void
}) {
  if (exercises.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-background p-5 text-center text-sm text-muted-foreground">
        Nenhum exercício adicionado nesse dia ainda.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {exercises.map((exercise) => (
        <article key={exercise.selectedId} className="rounded-lg border border-border bg-background p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold">{exercise.name}</p>
              <p className="text-sm text-muted-foreground">{exercise.muscleGroup}</p>
            </div>
            <Button size="icon" type="button" variant="ghost" onClick={() => onRemove(exercise.selectedId)} aria-label="Remover exercício">
              <Trash2 className="size-4" />
            </Button>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <label className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Séries</span>
              <Input
                min={1}
                type="number"
                value={exercise.sets}
                onChange={(event) => onUpdate(exercise.selectedId, { sets: Number(event.target.value) || 1 })}
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Reps</span>
              <Input value={exercise.reps} onChange={(event) => onUpdate(exercise.selectedId, { reps: event.target.value })} />
            </label>
            <label className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Descanso</span>
              <Input value={exercise.rest} onChange={(event) => onUpdate(exercise.selectedId, { rest: event.target.value })} />
            </label>
          </div>
        </article>
      ))}
    </div>
  )
}

function WorkoutReview({
  cardio,
  methodName,
  onNameChange,
  selectedDays,
  splitName,
  workoutDays,
  workoutName,
}: {
  cardio: CardioConfig
  methodName: string
  onNameChange: (name: string) => void
  selectedDays: WeekDayId[]
  splitName: string
  workoutDays: WorkoutDay[]
  workoutName: string
}) {
  return (
    <div className="space-y-5">
      <SectionHeader
        title="Revise e salve"
        description="Confira a estrutura do treino antes de salvar no mock local."
      />

      <label className="space-y-2">
        <span className="text-sm font-medium">Nome do treino</span>
        <Input value={workoutName} onChange={(event) => onNameChange(event.target.value)} />
      </label>

      <div className="grid gap-3 md:grid-cols-3">
        <ReviewStat label="Dias" value={selectedDays.map((id) => weekDays.find((day) => day.id === id)?.shortLabel).join(', ')} />
        <ReviewStat label="Metodologia" value={methodName} />
        <ReviewStat label="Divisão" value={splitName} />
      </div>

      <div className="rounded-lg border border-border bg-background p-4">
        <p className="font-semibold">Cardio</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {cardio.mode === 'Sem cardio'
            ? 'Sem cardio'
            : `${cardio.mode}: ${cardio.type}, ${cardio.intensity.toLowerCase()}, ${cardio.duration === 'Personalizado' ? cardio.customDuration : cardio.duration}, ${cardio.timing.toLowerCase()}.`}
        </p>
      </div>

      <div className="space-y-3">
        {workoutDays.map((day) => (
          <article key={day.dayId} className="rounded-lg border border-border bg-background p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">{weekDays.find((item) => item.id === day.dayId)?.label}</p>
                <h3 className="text-lg font-semibold">{day.focus}</h3>
              </div>
              <span className="rounded-md bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground">
                {day.exercises.length} exercícios
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {day.muscleGroups.map((id) => muscleNameById.get(id)).filter(Boolean).join(', ') || 'Sem grupos definidos'}
            </p>
            <div className="mt-4 space-y-2">
              {day.exercises.map((exercise) => (
                <div key={exercise.selectedId} className="rounded-md bg-muted px-3 py-2 text-sm">
                  <span className="font-medium">{exercise.name}</span>
                  <span className="text-muted-foreground">
                    {' '}
                    · {exercise.sets} séries · {exercise.reps} reps · {exercise.rest}
                  </span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="size-5 text-muted-foreground" />
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      </div>
      <p className="text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  )
}

function SelectField({
  compact,
  label,
  onChange,
  options,
  value,
}: {
  compact?: boolean
  label: string
  onChange: (value: string) => void
  options: string[]
  value: string
}) {
  return (
    <label className={cn('space-y-2', compact && 'space-y-1')}>
      <span className="text-sm font-medium">{label}</span>
      <select
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

function ReviewStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  )
}
