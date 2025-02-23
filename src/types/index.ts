export type WeightModifier = 'ea' | 'sole';

export type ExerciseType = 'BB' | 'DB';

export interface WeightSpec {
  value: number;
  modifier?: WeightModifier;
}

export interface Set {
  weight: WeightSpec;
  reps: number;
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