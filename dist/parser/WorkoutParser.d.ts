import { Workout, Exercise } from '../types/index.js';
export declare class WorkoutParser {
    private parser;
    constructor();
    parse(input: string): Workout;
    validateExercise(exercise: Exercise): boolean;
    formatWorkout(workout: Workout): string;
    private formatExercise;
}
//# sourceMappingURL=WorkoutParser.d.ts.map