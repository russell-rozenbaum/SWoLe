import * as fs from 'fs';
import * as path from 'path';
import * as pegjs from 'pegjs';
import { Workout, Exercise, WorkoutBlock } from '../types';

export class WorkoutParser {
  private parser: pegjs.Parser;

  constructor() {
    const grammarPath = path.join(__dirname, 'workout.pegjs');
    const grammar = fs.readFileSync(grammarPath, 'utf-8');
    this.parser = pegjs.generate(grammar);
  }

  parse(input: string): Workout {
    try {
      const result = this.parser.parse(input);
      return {
        date: new Date(),
        blocks: result.blocks as WorkoutBlock[]
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Parsing error: ${error.message}`);
      }
      throw error;
    }
  }

  // Helper method to validate exercise syntax
  validateExercise(exercise: Exercise): boolean {
    // Validate weight modifiers based on prefix
    for (const set of exercise.sets) {
      if (exercise.prefix === 'BB' && set.weight.modifier) {
        return false; // BB exercises shouldn't have modifiers
      }
      if (exercise.prefix === 'DB' && !set.weight.modifier) {
        return false; // DB exercises must have modifiers
      }
    }
    return true;
  }

  // Helper method to format workout as string
  formatWorkout(workout: Workout): string {
    let output = '';
    
    for (const block of workout.blocks) {
      if (block.type === 'single') {
        output += this.formatExercise(block.exercise);
      } else {
        output += 'split {\n';
        for (const exercise of block.exercises) {
          output += this.formatExercise(exercise, 2);
        }
        output += '}\n';
      }
    }
    
    return output;
  }

  private formatExercise(exercise: Exercise, indent = 0): string {
    const padding = ' '.repeat(indent);
    let output = `${padding}${exercise.prefix ? exercise.prefix + ' ' : ''}${exercise.name}\n`;
    
    for (const set of exercise.sets) {
      const modifier = set.weight.modifier ? set.weight.modifier : '';
      output += `${padding}${set.weight.value}${modifier} x ${set.reps}\n`;
    }
    
    return output;
  }
} 