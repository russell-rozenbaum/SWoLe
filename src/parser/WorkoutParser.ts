import * as fs from 'fs';
import * as path from 'path';
import * as pegjs from 'pegjs';
import { Workout, Exercise, WorkoutBlock, VALID_BW_EXERCISES } from '../types';

export interface ParserError {
  message: string;
  line: number;
  column: number;
  expected?: string[];
  found?: string;
  type: 'syntax' | 'validation';
}

interface ParserResult {
  date: Date;
  note?: string;
  blocks: WorkoutBlock[];
}

export class WorkoutParser {
  private parser: pegjs.Parser;
  private validBBExercises = new Set([
    'bench press',
    'squat',
    'deadlift',
    'row',
    'press',
    'curl',
    'rdl'
  ]);

  constructor() {
    const grammarPath = path.join(__dirname, 'workout.pegjs');
    const grammar = fs.readFileSync(grammarPath, 'utf-8');
    this.parser = pegjs.generate(grammar);
  }

  parse(input: string): { workout: Workout | null; errors: ParserError[] } {
    const errors: ParserError[] = [];
    let workout: Workout | null = null;

    try {
      const result = this.parser.parse(input) as ParserResult;
      workout = {
        date: result.date,
        note: result.note,
        blocks: result.blocks
      };

      // Validate the workout structure
      errors.push(...this.validateWorkout(workout, input));

    } catch (error) {
      if (error instanceof Error && 'location' in error) {
        const pegError = error as pegjs.parser.SyntaxError;
        errors.push({
          message: this.formatSyntaxError(pegError),
          line: pegError.location.start.line,
          column: pegError.location.start.column,
          expected: pegError.expected?.map(exp => 
            typeof exp === 'string' ? exp : exp.description),
          found: pegError.found,
          type: 'syntax'
        });
      } else {
        errors.push({
          message: error instanceof Error ? error.message : 'Unknown error',
          line: 1,
          column: 1,
          type: 'syntax'
        });
      }
    }

    if (errors.length > 0) {
      workout = null;
    }

    return { workout, errors };
  }

  private validateWorkout(workout: Workout, input: string): ParserError[] {
    const errors: ParserError[] = [];
    const lines = input.split('\n');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validate date
    if (workout.date > today) {
      errors.push({
        message: 'Workout date cannot be in the future',
        line: 1,
        column: 1,
        type: 'validation'
      });
      return errors;
    }

    // Validate each exercise block
    let currentLine = workout.note ? 2 : 1;
    workout.blocks.forEach(block => {
      if (block.type === 'single') {
        const blockErrors = this.validateExercise(block.exercise, currentLine, lines);
        if (blockErrors.length > 0) {
          errors.push(blockErrors[0]); // Only add the first error for each exercise
        }
        currentLine += block.exercise.sets.length + 1;
      } else {
        block.exercises.forEach(exercise => {
          const exerciseErrors = this.validateExercise(exercise, currentLine, lines);
          if (exerciseErrors.length > 0) {
            errors.push(exerciseErrors[0]); // Only add the first error for each exercise
          }
          currentLine += exercise.sets.length + 1;
        });
        currentLine += 2; // Account for superset block syntax
      }
    });

    return errors;
  }

  private validateExercise(exercise: Exercise, startLine: number, lines: string[]): ParserError[] {
    const errors: ParserError[] = [];
    const exerciseName = exercise.name.toLowerCase();

    // Skip validation if any placeholders are present
    if (exercise.sets.some(set => 
      (set.weight && set.weight.isPlaceholder) || 
      set.reps === '?' || 
      (set.dropSet && (Array.isArray(set.dropSet) ? 
        set.dropSet.some(ds => ds.isPlaceholder || ds.reps === '?') :
        set.dropSet.isPlaceholder || set.dropSet.reps === '?'))
    )) {
      return errors;
    }

    // Add missing BW prefix for known bodyweight exercises
    if (!exercise.prefix && VALID_BW_EXERCISES.has(exerciseName)) {
      exercise.prefix = 'BW';
    }

    // Validate equipment prefix matches exercise name
    if (exercise.prefix === 'BB' && 
        !this.validBBExercises.has(exerciseName)) {
      errors.push({
        message: `Invalid barbell exercise name: "${exercise.name}". Must be one of: ${Array.from(this.validBBExercises).join(', ')}`,
        line: startLine,
        column: 1,
        type: 'validation'
      });
      return errors;
    }

    // Validate bodyweight exercises
    if (exercise.prefix === 'BW' && !VALID_BW_EXERCISES.has(exerciseName)) {
      errors.push({
        message: `Invalid bodyweight exercise name: "${exercise.name}". Must be one of: ${Array.from(VALID_BW_EXERCISES).join(', ')}`,
        line: startLine,
        column: 1,
        type: 'validation'
      });
      return errors;
    }

    // Validate weight specifications
    for (const [idx, set] of exercise.sets.entries()) {
      const setLine = startLine + idx + 1;
      const lineContent = lines[setLine - 1] || '';

      // Skip validation for placeholder values
      if (set.weight.isPlaceholder || set.reps === '?' || 
          (set.dropSet && (Array.isArray(set.dropSet) ? 
            set.dropSet.some(ds => ds.isPlaceholder || ds.reps === '?') :
            set.dropSet.isPlaceholder || set.dropSet.reps === '?'))) {
        continue;
      }

      // Handle bodyweight exercises
      if (exercise.prefix === 'BW') {
        if (!set.weight.isBodyWeight) {
          errors.push({
            message: `Bodyweight exercises must use bodyweight: "${exercise.name}"`,
            line: setLine,
            column: lineContent.indexOf('x') - 2,
            type: 'validation'
          });
          break;
        }
      }
      // Handle non-bodyweight exercises
      else if (set.weight.isBodyWeight) {
        errors.push({
          message: `Cannot use bodyweight for non-bodyweight exercise: "${exercise.name}"`,
          line: setLine,
          column: lineContent.indexOf('x') - 2,
          type: 'validation'
        });
        break;
      }

      // Validate weight modifiers
      if (exercise.prefix === 'BB' && set.weight.modifier) {
        errors.push({
          message: 'Barbell exercises should not have weight modifiers',
          line: setLine,
          column: lineContent.indexOf('x') - 2,
          type: 'validation'
        });
        break;
      }

      if (exercise.prefix === 'DB' && !set.weight.modifier) {
        errors.push({
          message: 'Dumbbell exercises require a weight modifier (ea/sole)',
          line: setLine,
          column: lineContent.indexOf('x') - 1,
          type: 'validation'
        });
        break;
      }

      // Validate drop sets
      if (set.dropSet) {
        const dropSets = Array.isArray(set.dropSet) ? set.dropSet : [set.dropSet];
        for (const dropSet of dropSets) {
          // For bodyweight exercises, both weights must be bodyweight
          if (exercise.prefix === 'BW' && !dropSet.isBodyWeight) {
            errors.push({
              message: 'Bodyweight exercises must use bodyweight for drop sets',
              line: setLine,
              column: lineContent.indexOf('->') + 2,
              type: 'validation'
            });
            break;
          }
          // For dumbbell exercises, ensure modifiers are present
          if (exercise.prefix === 'DB' && !dropSet.modifier) {
            errors.push({
              message: 'Dumbbell exercises require a weight modifier (ea/sole)',
              line: setLine,
              column: lineContent.indexOf('->') + 2,
              type: 'validation'
            });
            break;
          }
          // For barbell exercises, ensure no modifiers are present
          if (exercise.prefix === 'BB' && dropSet.modifier) {
            errors.push({
              message: 'Barbell exercises should not have weight modifiers',
              line: setLine,
              column: lineContent.indexOf('->') + 2,
              type: 'validation'
            });
            break;
          }
        }
      }
    }

    return errors;
  }

  private formatSyntaxError(error: pegjs.parser.SyntaxError): string {
    const expected = error.expected
      ?.map(exp => typeof exp === 'string' ? exp : exp.description)
      .filter(Boolean)
      .join(', ');

    if (expected) {
      return `Expected ${expected} but found "${error.found}"`;
    }
    return error.message;
  }

  formatWorkout(workout: Workout | null): string {
    if (!workout) return '';
    
    let output = `${this.formatDate(workout.date)}\n`;
    if (workout.note) {
      output += `${workout.note}\n`;
    }
    
    for (const block of workout.blocks) {
      if (block.type === 'single') {
        output += this.formatExercise(block.exercise);
      } else {
        output += 'superset {\n';
        for (const exercise of block.exercises) {
          output += this.formatExercise(exercise, 2);
        }
        output += '}\n';
      }
    }
    
    return output;
  }

  private formatDate(date: Date): string {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

  private formatExercise(exercise: Exercise, indent = 0): string {
    const padding = ' '.repeat(indent);
    let output = `${padding}${exercise.prefix ? exercise.prefix + ' ' : ''}${exercise.name}\n`;
    
    for (const set of exercise.sets) {
      output += padding;
      
      // Format weight
      if (set.weight.isPlaceholder) {
        output += '?';
        if (set.weight.modifier) {
          output += set.weight.modifier;
        }
      } else if (set.weight.isBodyWeight) {
        output += 'bw';
        if (set.weight.bodyWeightModifier) {
          output += `${set.weight.bodyWeightModifier.operation}${set.weight.bodyWeightModifier.value}`;
        }
      } else {
        output += `${set.weight.value}${set.weight.modifier ? set.weight.modifier : ''}`;
      }
      
      output += ` x ${set.reps}`;
      
      if (set.failureNotes) {
        output += ` F${set.failureNotes.join(',')}`;
      }
      if (set.dropSet) {
        const dropSets = Array.isArray(set.dropSet) ? set.dropSet : [set.dropSet];
        for (const dropSet of dropSets) {
          output += ' -> ';
          if (dropSet.isPlaceholder) {
            output += '?';
            if (dropSet.modifier) {
              output += dropSet.modifier;
            }
          } else if (dropSet.isBodyWeight) {
            output += 'bw';
            if (dropSet.bodyWeightModifier) {
              output += `${dropSet.bodyWeightModifier.operation}${dropSet.bodyWeightModifier.value}`;
            }
          } else {
            output += `${dropSet.value}${dropSet.modifier ? dropSet.modifier : ''}`;
          }
          output += ` x ${dropSet.reps}`;
        }
      }
      if (set.negatives) {
        output += ` x ${set.negatives} negatives`;
      }
      output += '\n';
    }
    
    return output;
  }
} 