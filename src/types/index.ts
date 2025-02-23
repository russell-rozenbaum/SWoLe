export type WeightModifier = 'ea' | 'sole' | 'bw';

export type ExerciseType = 'BB' | 'DB' | 'BW' | 'Cable' | 'Machine';

export type WeightType = 'bodyweight' | 'weighted' | 'both';

export type WorkoutType = 'Push' | 'Pull' | 'Legs' | 'Core' | 'Yoga' | 'Other';

export type Location = 'Home' | 'Gym' | 'Outside' | 'Other';

export type MuscleGroup = 
  | 'Chest'
  | 'Front Deltoids'
  | 'Side Deltoids'
  | 'Rear Deltoids'
  | 'Triceps'
  | 'Biceps'
  | 'Upper Back'
  | 'Lats'
  | 'Lower Back'
  | 'Traps'
  | 'Forearms'
  | 'Quads'
  | 'Hamstrings'
  | 'Calves'
  | 'Glutes'
  | 'Hip Flexors'
  | 'Abs'
  | 'Obliques';

export type Category = 'Push' | 'Pull' | 'Legs';

export interface ExerciseReference {
  name: string;
  variations: string[];
  category: Category;
  muscleGroups: MuscleGroup[];
  equipment: ExerciseType[];
  weightType: WeightType;
  description?: string;
  template?: string;
}

export interface WeightSpec {
  value: number;
  modifier?: string;
  isBodyWeight?: boolean;
  bodyWeightModifier?: {
    operation: string;
    value: number;
  };
  isPlaceholder?: boolean;
}

export interface Set {
  weight: WeightSpec;
  reps: number | '?';
  failureNotes?: string[];
  dropSet?: WeightSpec & { reps: number | '?' };
  negatives?: number;
}

export interface Exercise {
  prefix?: ExerciseType;
  name: string;
  sets: Set[];
}

export type WorkoutBlock = 
  | { type: 'single'; exercise: Exercise }
  | { type: 'split'; exercises: Exercise[] };

export interface Workout {
  date: Date;
  note?: string;
  blocks: WorkoutBlock[];
}

export interface WorkoutHistory {
  exercises: Record<string, Exercise[]>;
}

export interface ProgressTrend {
  exercise: string;
  data: Array<{
    date: Date;
    volume: number;
    maxWeight: number;
  }>;
}

export interface ExerciseComparison {
  current: Exercise;
  previous?: Exercise;
  volumeChange?: number;
  maxWeightChange?: number;
}

// Add a list of valid bodyweight exercises
export const VALID_BW_EXERCISES = new Set([
  'pull ups',
  'push ups',
  'dips',
  'chin ups',
  'inverted rows',
  'pike push ups',
  'handstand push ups',
  'australian pull ups',
  'squats',
  'lunges',
  'burpees',
  'mountain climbers',
  'planks'
]); 