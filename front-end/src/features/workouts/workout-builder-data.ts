import type {
  CardioConfig,
  Exercise,
  MuscleGroup,
  WeekDay,
  WorkoutMethod,
  WorkoutMethodId,
  WorkoutSplit,
} from './workout-builder-types'

export const weekDays: WeekDay[] = [
  { id: 'mon', label: 'Segunda', shortLabel: 'Seg' },
  { id: 'tue', label: 'Terça', shortLabel: 'Ter' },
  { id: 'wed', label: 'Quarta', shortLabel: 'Qua' },
  { id: 'thu', label: 'Quinta', shortLabel: 'Qui' },
  { id: 'fri', label: 'Sexta', shortLabel: 'Sex' },
  { id: 'sat', label: 'Sábado', shortLabel: 'Sáb' },
  { id: 'sun', label: 'Domingo', shortLabel: 'Dom' },
]

export const workoutMethods: WorkoutMethod[] = [
  {
    id: 'low-volume',
    name: 'Low Volume',
    description: 'Menos séries válidas, mais intensidade, progressão de carga e recuperação.',
    volumeHint: '1 a 2 exercícios por músculo principal, 1 a 2 séries válidas e descanso maior.',
  },
  {
    id: 'high-volume',
    name: 'High Volume',
    description: 'Mais séries totais, maior volume semanal e mais trabalho por grupo muscular.',
    volumeHint: '2 a 4 exercícios por músculo principal, 3 a 5 séries e descanso moderado.',
  },
  {
    id: 'hybrid',
    name: 'Híbrido',
    description: 'Combina musculação com cardio, corrida, condicionamento ou funcional.',
    volumeHint: '2 a 3 exercícios por grupo principal com cardio leve ou moderado encaixado.',
  },
]

export const workoutSplits: WorkoutSplit[] = [
  { id: 'full-body', name: 'Full Body', description: 'Corpo inteiro em cada sessão.', recommendedDays: [1, 3] },
  { id: 'full-body-ab', name: 'Full Body A/B', description: 'Dois treinos completos alternados.', recommendedDays: [2] },
  { id: 'upper-lower', name: 'Upper/Lower', description: 'Alterna superiores e inferiores.', recommendedDays: [2, 4] },
  { id: 'push-pull-legs', name: 'Push/Pull/Legs', description: 'Empurrar, puxar e pernas.', recommendedDays: [3] },
  { id: 'abc', name: 'ABC', description: 'Três focos principais na semana.', recommendedDays: [3] },
  { id: 'abcd', name: 'ABCD', description: 'Quatro sessões com maior especificidade.', recommendedDays: [4] },
  { id: 'abcde', name: 'ABCDE', description: 'Cinco sessões com foco por região.', recommendedDays: [5] },
  { id: 'ppl-plus', name: 'PPL + complementos', description: 'PPL com sessões extras de ajuste.', recommendedDays: [5] },
  { id: 'ppl-ul', name: 'PPL/UL', description: 'Push, Pull, Legs, Upper e Lower na mesma semana.', recommendedDays: [5] },
  { id: 'ppl-2x', name: 'PPL 2x', description: 'Push, Pull e Legs repetidos duas vezes.', recommendedDays: [6] },
  { id: 'abc-2x', name: 'ABC 2x', description: 'ABC repetido duas vezes na semana.', recommendedDays: [6] },
  { id: 'active-rest', name: 'Treino + descanso ativo', description: '5 a 6 treinos com 1 ou 2 dias leves.', recommendedDays: [7] },
  { id: 'custom', name: 'Personalizado', description: 'Monte cada dia manualmente.', recommendedDays: [1, 2, 3, 4, 5, 6, 7] },
]

export const muscleGroups: MuscleGroup[] = [
  { id: 'peito', name: 'Peito', category: 'Superiores' },
  { id: 'costas', name: 'Costas', category: 'Superiores' },
  { id: 'ombros', name: 'Ombros', category: 'Superiores' },
  { id: 'biceps', name: 'Bíceps', category: 'Superiores' },
  { id: 'triceps', name: 'Tríceps', category: 'Superiores' },
  { id: 'antebraco', name: 'Antebraço', category: 'Superiores' },
  { id: 'abdomen', name: 'Abdômen', category: 'Superiores' },
  { id: 'trapezio', name: 'Trapézio', category: 'Superiores' },
  { id: 'quadriceps', name: 'Quadríceps', category: 'Inferiores' },
  { id: 'posterior-de-coxa', name: 'Posterior de coxa', category: 'Inferiores' },
  { id: 'gluteos', name: 'Glúteos', category: 'Inferiores' },
  { id: 'panturrilha', name: 'Panturrilha', category: 'Inferiores' },
  { id: 'adutores', name: 'Adutores', category: 'Inferiores' },
  { id: 'abdutores', name: 'Abdutores', category: 'Inferiores' },
  { id: 'caminhada', name: 'Caminhada', category: 'Cardio' },
  { id: 'corrida', name: 'Corrida', category: 'Cardio' },
  { id: 'bicicleta', name: 'Bicicleta', category: 'Cardio' },
  { id: 'escada', name: 'Escada', category: 'Cardio' },
  { id: 'eliptico', name: 'Elíptico', category: 'Cardio' },
  { id: 'hiit', name: 'HIIT', category: 'Cardio' },
  { id: 'cardio-leve', name: 'Cardio leve', category: 'Cardio' },
  { id: 'cardio-moderado', name: 'Cardio moderado', category: 'Cardio' },
  { id: 'cardio-intenso', name: 'Cardio intenso', category: 'Cardio' },
]

export const workoutFocusOptions = [
  'Full Body',
  'Upper',
  'Lower',
  'Push',
  'Pull',
  'Legs',
  'Peito',
  'Costas',
  'Ombros',
  'Braços',
  'Bíceps',
  'Tríceps',
  'Pernas',
  'Quadríceps',
  'Posterior',
  'Glúteos',
  'Panturrilha',
  'Abdômen',
  'Cardio',
  'Descanso ativo',
  'Peito + Tríceps',
  'Costas + Bíceps',
  'Ombro + Braços',
  'Ombro + Bíceps + Tríceps',
  'Quadríceps + Panturrilha',
  'Posterior + Glúteos',
  'Pernas completas',
  'Peito + Ombro + Tríceps',
  'Costas + Posterior de ombro + Bíceps',
  'Full Body + Cardio',
  'Upper + Cardio',
  'Lower + Cardio',
  'Personalizado',
]

export const focusMuscleMap: Record<string, string[]> = {
  'Full Body': ['peito', 'costas', 'quadriceps', 'posterior-de-coxa', 'abdomen'],
  Upper: ['peito', 'costas', 'ombros', 'biceps', 'triceps'],
  Lower: ['quadriceps', 'posterior-de-coxa', 'gluteos', 'panturrilha'],
  Push: ['peito', 'ombros', 'triceps'],
  Pull: ['costas', 'biceps', 'trapezio'],
  Legs: ['quadriceps', 'posterior-de-coxa', 'gluteos', 'panturrilha'],
  Peito: ['peito'],
  Costas: ['costas'],
  Ombros: ['ombros'],
  Braços: ['biceps', 'triceps', 'antebraco'],
  Bíceps: ['biceps'],
  Tríceps: ['triceps'],
  Pernas: ['quadriceps', 'posterior-de-coxa', 'gluteos', 'panturrilha'],
  Quadríceps: ['quadriceps'],
  Posterior: ['posterior-de-coxa'],
  Glúteos: ['gluteos'],
  Panturrilha: ['panturrilha'],
  Abdômen: ['abdomen'],
  Cardio: ['corrida', 'bicicleta'],
  'Descanso ativo': ['caminhada', 'cardio-leve'],
  'Peito + Tríceps': ['peito', 'triceps'],
  'Costas + Bíceps': ['costas', 'biceps'],
  'Ombro + Braços': ['ombros', 'biceps', 'triceps'],
  'Ombro + Bíceps + Tríceps': ['ombros', 'biceps', 'triceps'],
  'Quadríceps + Panturrilha': ['quadriceps', 'panturrilha'],
  'Posterior + Glúteos': ['posterior-de-coxa', 'gluteos'],
  'Pernas completas': ['quadriceps', 'posterior-de-coxa', 'gluteos', 'panturrilha', 'adutores', 'abdutores'],
  'Peito + Ombro + Tríceps': ['peito', 'ombros', 'triceps'],
  'Costas + Posterior de ombro + Bíceps': ['costas', 'ombros', 'biceps'],
  'Full Body + Cardio': ['peito', 'costas', 'quadriceps', 'posterior-de-coxa', 'cardio-moderado'],
  'Upper + Cardio': ['peito', 'costas', 'ombros', 'biceps', 'triceps', 'cardio-moderado'],
  'Lower + Cardio': ['quadriceps', 'posterior-de-coxa', 'gluteos', 'panturrilha', 'cardio-moderado'],
}

export const defaultCardioConfig: CardioConfig = {
  mode: 'Sem cardio',
  type: 'Caminhada',
  intensity: 'Leve',
  duration: '20 min',
  customDuration: '',
  timing: 'Depois do treino',
}

export const cardioModes = [
  'Sem cardio',
  'Cardio apenas nos dias de treino',
  'Cardio apenas nos dias de descanso',
  'Cardio nos dias de treino e descanso',
  'Cardio personalizado',
]

export const cardioTypes = ['Caminhada', 'Corrida', 'Bicicleta', 'Escada', 'Elíptico', 'HIIT']
export const cardioIntensities = ['Leve', 'Moderada', 'Alta']
export const cardioDurations = ['10 min', '15 min', '20 min', '30 min', '40 min', '60 min', 'Personalizado']
export const cardioTimings = ['Antes do treino', 'Depois do treino', 'Separado da musculação', 'Em dia de descanso']

export function getVolumeDefaults(method: WorkoutMethodId) {
  if (method === 'high-volume') {
    return { sets: 4, reps: '8-12', rest: '60-90s' }
  }

  if (method === 'hybrid') {
    return { sets: 3, reps: '10-15', rest: '60s' }
  }

  return { sets: 2, reps: '6-10', rest: '2-3min' }
}

export function getSuggestedSplitIds(dayCount: number) {
  return workoutSplits.filter((split) => split.recommendedDays.includes(dayCount)).map((split) => split.id)
}

const makeExercise = (
  id: string,
  name: string,
  muscleGroup: string,
  subgroup: string,
  equipment: string[],
  variations: string[],
): Exercise => ({ id, name, muscleGroup, subgroup, equipment, variations })

export const exerciseDatabase: Exercise[] = [
  makeExercise('supino-reto', 'Supino reto', 'Peito', 'Peitoral maior - parte média', ['barra', 'halteres', 'máquina', 'Smith'], ['Supino reto com barra', 'Supino reto com halteres', 'Supino reto na máquina', 'Supino reto no Smith', 'Supino reto com pegada fechada']),
  makeExercise('crucifixo-reto', 'Crucifixo reto', 'Peito', 'Peitoral maior - parte média', ['halteres', 'máquina', 'cabo'], ['Crucifixo reto com halteres', 'Crucifixo na máquina voador', 'Crucifixo reto no cabo', 'Crucifixo unilateral']),
  makeExercise('flexao', 'Flexão de braço', 'Peito', 'Peitoral maior - parte média', ['peso corporal'], ['Flexão tradicional', 'Flexão com joelhos apoiados', 'Flexão com pés elevados', 'Flexão com mãos abertas', 'Flexão com carga']),
  makeExercise('supino-inclinado', 'Supino inclinado', 'Peito', 'Peitoral superior', ['barra', 'halteres', 'máquina', 'Smith'], ['Supino inclinado com barra', 'Supino inclinado com halteres', 'Supino inclinado na máquina', 'Supino inclinado no Smith', 'Supino inclinado unilateral']),
  makeExercise('crucifixo-inclinado', 'Crucifixo inclinado', 'Peito', 'Peitoral superior', ['halteres', 'cabo'], ['Crucifixo inclinado com halteres', 'Crucifixo inclinado no cabo', 'Crucifixo inclinado unilateral']),
  makeExercise('crossover-baixo', 'Crossover baixo para cima', 'Peito', 'Peitoral superior', ['polia/cabo'], ['Crossover baixo bilateral', 'Crossover baixo unilateral', 'Crossover ajoelhado']),
  makeExercise('supino-declinado', 'Supino declinado', 'Peito', 'Peitoral inferior', ['barra', 'halteres', 'máquina'], ['Supino declinado com barra', 'Supino declinado com halteres', 'Supino declinado na máquina']),
  makeExercise('paralelas-peito', 'Paralelas com foco em peito', 'Peito', 'Peitoral inferior', ['peso corporal', 'máquina gravitron'], ['Paralelas livres', 'Paralelas no gravitron', 'Paralelas com carga', 'Paralelas com tronco inclinado']),
  makeExercise('crossover-alto', 'Crossover alto para baixo', 'Peito', 'Peitoral inferior', ['polia/cabo'], ['Crossover alto bilateral', 'Crossover alto unilateral', 'Crossover ajoelhado']),
  makeExercise('puxada-alta', 'Puxada alta', 'Costas', 'Dorsal / asa', ['polia', 'máquina'], ['Puxada alta aberta', 'Puxada alta fechada', 'Puxada alta pegada neutra', 'Puxada alta supinada', 'Puxada alta unilateral', 'Puxada atrás da nuca']),
  makeExercise('barra-fixa', 'Barra fixa', 'Costas', 'Dorsal / asa', ['peso corporal', 'elástico', 'gravitron'], ['Barra fixa pronada', 'Barra fixa supinada', 'Barra fixa neutra', 'Barra fixa com elástico', 'Barra fixa no gravitron', 'Barra fixa com carga']),
  makeExercise('pulldown', 'Pulldown', 'Costas', 'Dorsal / asa', ['polia/cabo'], ['Pulldown com corda', 'Pulldown com barra reta', 'Pulldown unilateral', 'Pulldown ajoelhado']),
  makeExercise('remada-curvada', 'Remada curvada', 'Costas', 'Meio das costas', ['barra', 'halteres'], ['Remada curvada com barra', 'Remada curvada com halteres', 'Remada curvada pegada pronada', 'Remada curvada pegada supinada']),
  makeExercise('remada-baixa', 'Remada baixa', 'Costas', 'Meio das costas', ['polia', 'máquina'], ['Remada baixa triangulo', 'Remada baixa barra reta', 'Remada baixa pegada aberta', 'Remada baixa unilateral', 'Remada baixa com corda']),
  makeExercise('remada-unilateral', 'Remada unilateral', 'Costas', 'Meio das costas', ['halter', 'máquina', 'cabo'], ['Remada unilateral com halter', 'Remada unilateral na máquina', 'Remada unilateral no cabo', 'Remada serrote']),
  makeExercise('remada-cavalinho', 'Remada cavalinho', 'Costas', 'Meio das costas', ['barra', 'máquina'], ['Remada cavalinho livre', 'Remada cavalinho com apoio no peito', 'Remada cavalinho máquina', 'Remada T-bar']),
  makeExercise('levantamento-terra', 'Levantamento terra', 'Costas', 'Lombar', ['barra', 'halteres', 'trap bar'], ['Terra tradicional', 'Terra sumô', 'Terra romeno', 'Terra com trap bar', 'Terra com halteres']),
  makeExercise('hiperextensao-lombar', 'Hiperextensão lombar', 'Costas', 'Lombar', ['banco romano', 'peso corporal', 'anilha'], ['Hiperextensão livre', 'Hiperextensão com anilha', 'Hiperextensão unilateral', 'Hiperextensão 45 graus']),
  makeExercise('good-morning', 'Good morning', 'Costas', 'Lombar', ['barra', 'Smith'], ['Good morning com barra', 'Good morning no Smith', 'Good morning com elástico']),
  makeExercise('desenvolvimento', 'Desenvolvimento', 'Ombros', 'Deltoide anterior', ['halteres', 'barra', 'máquina', 'Smith'], ['Desenvolvimento com halteres', 'Desenvolvimento com barra', 'Desenvolvimento máquina', 'Desenvolvimento no Smith', 'Desenvolvimento Arnold', 'Desenvolvimento unilateral']),
  makeExercise('elevacao-frontal', 'Elevação frontal', 'Ombros', 'Deltoide anterior', ['halteres', 'barra', 'anilha', 'cabo'], ['Elevação frontal com halteres', 'Elevação frontal com barra', 'Elevação frontal com anilha', 'Elevação frontal no cabo', 'Elevação frontal unilateral']),
  makeExercise('elevacao-lateral', 'Elevação lateral', 'Ombros', 'Deltoide lateral', ['halteres', 'cabo', 'máquina'], ['Elevação lateral com halteres', 'Elevação lateral no cabo', 'Elevação lateral na máquina', 'Elevação lateral unilateral', 'Elevação lateral inclinada', 'Elevação lateral sentado']),
  makeExercise('remada-alta', 'Remada alta', 'Ombros', 'Deltoide lateral', ['barra', 'halteres', 'cabo', 'Smith'], ['Remada alta com barra', 'Remada alta com halteres', 'Remada alta no cabo', 'Remada alta no Smith', 'Remada alta com corda']),
  makeExercise('voador-inverso', 'Voador inverso', 'Ombros', 'Deltoide posterior', ['máquina', 'halteres', 'cabo'], ['Voador inverso na máquina', 'Crucifixo inverso com halteres', 'Crucifixo inverso no cabo', 'Crucifixo inverso inclinado', 'Crucifixo inverso unilateral']),
  makeExercise('face-pull', 'Face pull', 'Ombros', 'Deltoide posterior', ['polia/cabo'], ['Face pull com corda', 'Face pull alto', 'Face pull ajoelhado', 'Face pull unilateral']),
  makeExercise('encolhimento', 'Encolhimento', 'Trapézio', 'Trapézio', ['halteres', 'barra', 'máquina', 'Smith'], ['Encolhimento com halteres', 'Encolhimento com barra', 'Encolhimento no Smith', 'Encolhimento na máquina', 'Encolhimento atrás do corpo']),
  makeExercise('farmer-walk', 'Farmer walk', 'Trapézio', 'Trapézio', ['halteres', 'kettlebell', 'trap bar'], ['Caminhada do fazendeiro com halteres', 'Farmer walk com kettlebell', 'Farmer walk unilateral', 'Farmer walk pesado']),
  makeExercise('rosca-direta', 'Rosca direta', 'Bíceps', 'Bíceps braquial', ['barra reta', 'barra W', 'cabo'], ['Rosca direta com barra reta', 'Rosca direta com barra W', 'Rosca direta no cabo', 'Rosca direta na máquina', 'Rosca direta pegada fechada', 'Rosca direta pegada aberta']),
  makeExercise('rosca-alternada', 'Rosca alternada', 'Bíceps', 'Bíceps braquial', ['halteres'], ['Rosca alternada em pé', 'Rosca alternada sentado', 'Rosca alternada com supinação', 'Rosca alternada inclinada']),
  makeExercise('rosca-concentrada', 'Rosca concentrada', 'Bíceps', 'Bíceps braquial', ['halter', 'cabo'], ['Rosca concentrada com halter', 'Rosca concentrada no cabo', 'Rosca concentrada apoiada']),
  makeExercise('rosca-scott', 'Rosca Scott', 'Bíceps', 'Bíceps braquial', ['banco Scott', 'máquina', 'barra W', 'halter'], ['Rosca Scott com barra W', 'Rosca Scott com halter', 'Rosca Scott unilateral', 'Rosca Scott na máquina', 'Rosca Scott no cabo']),
  makeExercise('rosca-martelo', 'Rosca martelo', 'Bíceps', 'Braquial e braquiorradial', ['halteres', 'corda', 'cabo'], ['Rosca martelo com halteres', 'Rosca martelo alternada', 'Rosca martelo cruzada', 'Rosca martelo com corda', 'Rosca martelo no banco inclinado']),
  makeExercise('rosca-inversa', 'Rosca inversa', 'Bíceps', 'Braquial e braquiorradial', ['barra reta', 'barra W', 'cabo'], ['Rosca inversa com barra', 'Rosca inversa com barra W', 'Rosca inversa no cabo', 'Rosca inversa unilateral']),
  makeExercise('triceps-pulley', 'Tríceps pulley', 'Tríceps', 'Tríceps geral', ['polia/cabo'], ['Tríceps pulley com barra reta', 'Tríceps pulley com corda', 'Tríceps pulley com barra V', 'Tríceps pulley unilateral', 'Tríceps pulley pegada supinada']),
  makeExercise('triceps-testa', 'Tríceps testa', 'Tríceps', 'Tríceps geral', ['barra W', 'barra reta', 'halteres', 'cabo'], ['Tríceps testa com barra W', 'Tríceps testa com halteres', 'Tríceps testa no cabo', 'Tríceps testa inclinado', 'Tríceps testa unilateral']),
  makeExercise('triceps-frances', 'Tríceps francês', 'Tríceps', 'Tríceps geral', ['halter', 'barra', 'cabo'], ['Tríceps francês com halter', 'Tríceps francês bilateral', 'Tríceps francês unilateral', 'Tríceps francês no cabo', 'Tríceps francês com corda']),
  makeExercise('mergulho-banco', 'Mergulho no banco', 'Tríceps', 'Tríceps geral', ['peso corporal', 'banco'], ['Mergulho no banco', 'Mergulho com pés elevados', 'Mergulho com carga']),
  makeExercise('paralelas-triceps', 'Paralelas com foco em tríceps', 'Tríceps', 'Tríceps geral', ['peso corporal', 'gravitron'], ['Paralelas livres', 'Paralelas no gravitron', 'Paralelas com carga', 'Paralelas com tronco mais vertical']),
  makeExercise('supino-fechado', 'Supino fechado', 'Tríceps', 'Tríceps geral', ['barra', 'Smith', 'máquina'], ['Supino fechado com barra', 'Supino fechado no Smith', 'Supino fechado na máquina']),
  makeExercise('rosca-punho', 'Rosca punho', 'Antebraço', 'Flexores do antebraço', ['barra', 'halteres', 'cabo'], ['Rosca punho com barra', 'Rosca punho com halteres', 'Rosca punho unilateral', 'Rosca punho no cabo']),
  makeExercise('rosca-punho-inversa', 'Rosca punho inversa', 'Antebraço', 'Extensores do antebraço', ['barra', 'halteres', 'cabo'], ['Rosca punho inversa com barra', 'Rosca punho inversa com halter', 'Rosca punho inversa no cabo']),
  makeExercise('grip', 'Exercícios de grip', 'Antebraço', 'Pegada', ['halteres', 'barra', 'hand grip', 'toalha'], ['Farmer walk', 'Dead hang', 'Segurar anilhas', 'Hand grip', 'Barra fixa com toalha']),
  makeExercise('crunch', 'Abdominal crunch', 'Abdômen', 'Abdômen superior', ['solo', 'máquina', 'cabo'], ['Crunch no solo', 'Crunch na máquina', 'Crunch no cabo', 'Crunch com carga', 'Crunch na bola suíça']),
  makeExercise('abdominal-supra', 'Abdominal supra', 'Abdômen', 'Abdômen superior', ['solo', 'banco'], ['Supra tradicional', 'Supra com pés apoiados', 'Supra com carga', 'Supra no banco declinado']),
  makeExercise('elevacao-pernas', 'Elevação de pernas', 'Abdômen', 'Abdômen inferior', ['solo', 'barra', 'paralelas', 'banco'], ['Elevação de pernas no solo', 'Elevação de pernas na barra', 'Elevação de joelhos na barra', 'Elevação de pernas nas paralelas', 'Elevação de pernas no banco']),
  makeExercise('abdominal-reverso', 'Abdominal reverso', 'Abdômen', 'Abdômen inferior', ['solo', 'banco'], ['Reverso tradicional', 'Reverso no banco', 'Reverso com bola', 'Reverso com carga']),
  makeExercise('abdominal-lateral', 'Abdominal lateral', 'Abdômen', 'Oblíquos', ['solo', 'cabo', 'halter'], ['Abdominal lateral no solo', 'Abdominal lateral com halter', 'Abdominal lateral no cabo', 'Prancha lateral']),
  makeExercise('rotacao-tronco', 'Rotação de tronco', 'Abdômen', 'Oblíquos', ['cabo', 'máquina', 'medicine ball'], ['Rotação no cabo', 'Rotação na máquina', 'Russian twist', 'Woodchopper alto para baixo', 'Woodchopper baixo para alto']),
  makeExercise('prancha', 'Prancha', 'Abdômen', 'Core geral', ['peso corporal'], ['Prancha tradicional', 'Prancha lateral', 'Prancha com toque no ombro', 'Prancha com elevação de perna', 'Prancha dinâmica']),
  makeExercise('ab-wheel', 'Ab wheel', 'Abdômen', 'Core geral', ['roda abdominal'], ['Ab wheel ajoelhado', 'Ab wheel em pé', 'Ab wheel parcial', 'Ab wheel com pausa']),
  makeExercise('agachamento', 'Agachamento', 'Quadríceps', 'Quadríceps geral', ['barra', 'halteres', 'Smith', 'peso corporal'], ['Agachamento livre', 'Agachamento no Smith', 'Agachamento goblet', 'Agachamento frontal', 'Agachamento sumô', 'Agachamento com halteres', 'Agachamento búlgaro']),
  makeExercise('leg-press', 'Leg press', 'Quadríceps', 'Quadríceps geral', ['máquina'], ['Leg press 45 graus', 'Leg press horizontal', 'Leg press unilateral', 'Leg press pés baixos', 'Leg press pés fechados', 'Leg press pés abertos']),
  makeExercise('cadeira-extensora', 'Cadeira extensora', 'Quadríceps', 'Quadríceps geral', ['máquina'], ['Extensora bilateral', 'Extensora unilateral', 'Extensora com pausa', 'Extensora com drop set', 'Extensora com isometria']),
  makeExercise('afundo', 'Afundo', 'Quadríceps', 'Quadríceps geral', ['peso corporal', 'halteres', 'barra', 'Smith'], ['Afundo parado', 'Afundo caminhando', 'Afundo com halteres', 'Afundo com barra', 'Afundo no Smith', 'Passada']),
  makeExercise('hack-squat', 'Hack squat', 'Quadríceps', 'Quadríceps geral', ['máquina'], ['Hack squat tradicional', 'Hack squat pés baixos', 'Hack squat pés altos', 'Hack squat unilateral']),
  makeExercise('mesa-flexora', 'Mesa flexora', 'Posterior de coxa', 'Isquiotibiais', ['máquina'], ['Mesa flexora bilateral', 'Mesa flexora unilateral', 'Mesa flexora com pausa', 'Mesa flexora com isometria']),
  makeExercise('cadeira-flexora', 'Cadeira flexora', 'Posterior de coxa', 'Isquiotibiais', ['máquina'], ['Cadeira flexora bilateral', 'Cadeira flexora unilateral', 'Cadeira flexora com pausa']),
  makeExercise('stiff', 'Stiff', 'Posterior de coxa', 'Isquiotibiais', ['barra', 'halteres', 'Smith'], ['Stiff com barra', 'Stiff com halteres', 'Stiff no Smith', 'Stiff unilateral', 'Stiff com déficit']),
  makeExercise('terra-romeno', 'Levantamento terra romeno', 'Posterior de coxa', 'Isquiotibiais', ['barra', 'halteres'], ['Terra romeno com barra', 'Terra romeno com halteres', 'Terra romeno unilateral']),
  makeExercise('glute-ham-raise', 'Glute ham raise', 'Posterior de coxa', 'Isquiotibiais', ['máquina específica', 'banco'], ['Glute ham raise livre', 'Glute ham raise assistido', 'Nordic curl']),
  makeExercise('elevacao-pelvica', 'Elevação pélvica', 'Glúteos', 'Glúteo máximo', ['barra', 'máquina', 'Smith', 'peso corporal'], ['Elevação pélvica com barra', 'Elevação pélvica na máquina', 'Elevação pélvica no Smith', 'Elevação pélvica unilateral', 'Hip thrust', 'Glute bridge']),
  makeExercise('agachamento-sumo', 'Agachamento sumô', 'Glúteos', 'Glúteo máximo', ['barra', 'halter', 'Smith'], ['Sumô com halter', 'Sumô com barra', 'Sumô no Smith', 'Sumô no step']),
  makeExercise('coice', 'Coice', 'Glúteos', 'Glúteo máximo', ['polia', 'máquina', 'caneleira'], ['Coice na polia', 'Coice na máquina', 'Coice com caneleira', 'Coice no banco']),
  makeExercise('step-up', 'Step-up', 'Glúteos', 'Glúteo máximo', ['caixa', 'banco', 'halteres'], ['Step-up com peso corporal', 'Step-up com halteres', 'Step-up alto', 'Step-up lateral']),
  makeExercise('abducao-quadril', 'Abdução de quadril', 'Glúteos', 'Glúteo médio e mínimo', ['máquina', 'polia', 'elástico', 'caneleira'], ['Cadeira abdutora', 'Abdução em pé na polia', 'Abdução deitado', 'Abdução com elástico', 'Caminhada lateral com elástico']),
  makeExercise('elevacao-lateral-perna', 'Elevação lateral de perna', 'Glúteos', 'Glúteo médio e mínimo', ['peso corporal', 'caneleira', 'elástico'], ['Elevação lateral deitado', 'Elevação lateral em pé', 'Elevação lateral com caneleira', 'Elevação lateral com elástico']),
  makeExercise('panturrilha-em-pe', 'Panturrilha em pé', 'Panturrilha', 'Gastrocnêmio', ['máquina', 'Smith', 'halteres'], ['Panturrilha em pé na máquina', 'Panturrilha em pé no Smith', 'Panturrilha em pé com halteres', 'Panturrilha unilateral', 'Panturrilha no leg press']),
  makeExercise('panturrilha-leg-press', 'Panturrilha no leg press', 'Panturrilha', 'Gastrocnêmio', ['leg press'], ['Panturrilha bilateral', 'Panturrilha unilateral', 'Panturrilha com pés paralelos', 'Panturrilha com ponta dos pés para fora', 'Panturrilha com ponta dos pés para dentro']),
  makeExercise('panturrilha-sentado', 'Panturrilha sentado', 'Panturrilha', 'Sóleo', ['máquina', 'halteres'], ['Panturrilha sentado na máquina', 'Panturrilha sentado com halter', 'Panturrilha unilateral sentado']),
  makeExercise('cadeira-adutora', 'Cadeira adutora', 'Adutores', 'Parte interna da coxa', ['máquina'], ['Adutora bilateral', 'Adutora com pausa', 'Adutora com isometria']),
  makeExercise('aducao-polia', 'Adução na polia', 'Adutores', 'Parte interna da coxa', ['cabo/polia'], ['Adução em pé na polia', 'Adução unilateral', 'Adução cruzada']),
  makeExercise('aducao-deitado', 'Adução deitado', 'Adutores', 'Parte interna da coxa', ['peso corporal', 'caneleira'], ['Adução lateral deitado', 'Adução com caneleira', 'Adução com elástico']),
  makeExercise('cadeira-abdutora', 'Cadeira abdutora', 'Abdutores', 'Parte lateral do quadril', ['máquina'], ['Abdutora tradicional', 'Abdutora inclinada para frente', 'Abdutora com pausa', 'Abdutora com isometria']),
  makeExercise('abducao-polia', 'Abdução na polia', 'Abdutores', 'Parte lateral do quadril', ['cabo/polia'], ['Abdução em pé', 'Abdução unilateral', 'Abdução com tronco apoiado']),
  makeExercise('caminhada-lateral', 'Caminhada lateral', 'Abdutores', 'Parte lateral do quadril', ['elástico'], ['Caminhada lateral com mini band', 'Caminhada em semi-agachamento', 'Monster walk']),
]
