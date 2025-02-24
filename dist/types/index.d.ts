export type WeightModifier = 'ea' | 'sole';
export type ExerciseType = 'BB' | 'DB';
export interface WeightSpec {
    value: number;
    modifier?: string;
}
export interface DropSet {
    weight: WeightSpec;
    reps: number;
}
export interface Set {
    weight: WeightSpec;
    reps: number;
    failureNotes?: number[];
    dropSet?: DropSet;
    negatives?: number;
}
export interface Exercise {
    prefix?: ExerciseType;
    name: string;
    sets: Set[];
}
export type WorkoutBlock = {
    type: 'single';
    exercise: Exercise;
} | {
    type: 'superset';
    exercises: Exercise[];
};
export interface Workout {
    date: Date;
    location?: string;
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
//# sourceMappingURL=index.d.ts.map