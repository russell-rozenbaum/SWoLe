"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutParser = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const pegjs = __importStar(require("pegjs"));
const types_1 = require("../types");
class WorkoutParser {
    constructor() {
        this.validBBExercises = new Set([
            'bench press',
            'squat',
            'deadlift',
            'row',
            'press',
            'curl',
            'rdl'
        ]);
        const grammarPath = path.join(__dirname, 'workout.pegjs');
        const grammar = fs.readFileSync(grammarPath, 'utf-8');
        this.parser = pegjs.generate(grammar);
    }
    parse(input) {
        var _a;
        const errors = [];
        let workout = null;
        try {
            const result = this.parser.parse(input);
            workout = {
                date: result.date,
                note: result.note,
                blocks: result.blocks
            };
            // Validate the workout structure
            errors.push(...this.validateWorkout(workout, input));
        }
        catch (error) {
            if (error instanceof Error && 'location' in error) {
                const pegError = error;
                errors.push({
                    message: this.formatSyntaxError(pegError),
                    line: pegError.location.start.line,
                    column: pegError.location.start.column,
                    expected: (_a = pegError.expected) === null || _a === void 0 ? void 0 : _a.map(exp => typeof exp === 'string' ? exp : exp.description),
                    found: pegError.found,
                    type: 'syntax'
                });
            }
            else {
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
    validateWorkout(workout, input) {
        const errors = [];
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
            }
            else {
                block.exercises.forEach(exercise => {
                    const exerciseErrors = this.validateExercise(exercise, currentLine, lines);
                    if (exerciseErrors.length > 0) {
                        errors.push(exerciseErrors[0]); // Only add the first error for each exercise
                    }
                    currentLine += exercise.sets.length + 1;
                });
                currentLine += 2; // Account for split block syntax
            }
        });
        return errors;
    }
    validateExercise(exercise, startLine, lines) {
        const errors = [];
        const exerciseName = exercise.name.toLowerCase();
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
        if (exercise.prefix === 'BW' && !types_1.VALID_BW_EXERCISES.has(exerciseName)) {
            errors.push({
                message: `Invalid bodyweight exercise name: "${exercise.name}". Must be one of: ${Array.from(types_1.VALID_BW_EXERCISES).join(', ')}`,
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
            // Validate bodyweight usage
            if (set.weight.isBodyWeight && !types_1.VALID_BW_EXERCISES.has(exerciseName)) {
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
                // For bodyweight exercises, both weights must be bodyweight
                if (types_1.VALID_BW_EXERCISES.has(exerciseName)) {
                    if (!set.weight.isBodyWeight || !set.dropSet.isBodyWeight) {
                        errors.push({
                            message: 'Bodyweight exercises must use bodyweight for drop sets',
                            line: setLine,
                            column: lineContent.indexOf('->') + 2,
                            type: 'validation'
                        });
                        break;
                    }
                }
                // For weighted exercises, both weights must be weighted
                else if (exercise.prefix === 'BB' || exercise.prefix === 'DB') {
                    if (set.dropSet.isBodyWeight || set.weight.isBodyWeight) {
                        errors.push({
                            message: 'Weighted exercises cannot use bodyweight for drop sets',
                            line: setLine,
                            column: lineContent.indexOf('->') + 2,
                            type: 'validation'
                        });
                        break;
                    }
                    if (set.dropSet.modifier !== set.weight.modifier) {
                        errors.push({
                            message: 'Drop set must use the same weight modifier',
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
    formatSyntaxError(error) {
        var _a;
        const expected = (_a = error.expected) === null || _a === void 0 ? void 0 : _a.map(exp => typeof exp === 'string' ? exp : exp.description).filter(Boolean).join(', ');
        if (expected) {
            return `Expected ${expected} but found "${error.found}"`;
        }
        return error.message;
    }
    formatWorkout(workout) {
        if (!workout)
            return '';
        let output = `${this.formatDate(workout.date)}\n`;
        if (workout.note) {
            output += `${workout.note}\n`;
        }
        for (const block of workout.blocks) {
            if (block.type === 'single') {
                output += this.formatExercise(block.exercise);
            }
            else {
                output += 'split {\n';
                for (const exercise of block.exercises) {
                    output += this.formatExercise(exercise, 2);
                }
                output += '}\n';
            }
        }
        return output;
    }
    formatDate(date) {
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }
    formatExercise(exercise, indent = 0) {
        const padding = ' '.repeat(indent);
        let output = `${padding}${exercise.prefix ? exercise.prefix + ' ' : ''}${exercise.name}\n`;
        for (const set of exercise.sets) {
            output += padding;
            // Format weight
            if (set.weight.isBodyWeight) {
                output += 'bw';
                if (set.weight.bodyWeightModifier) {
                    output += `${set.weight.bodyWeightModifier.operation}${set.weight.bodyWeightModifier.value}`;
                }
            }
            else {
                output += `${set.weight.value}${set.weight.modifier ? set.weight.modifier : ''}`;
            }
            output += ` x ${set.reps}`;
            if (set.failureNotes) {
                output += ` F${set.failureNotes.join(',')}`;
            }
            if (set.dropSet) {
                output += ' drop to ';
                if (set.dropSet.isBodyWeight) {
                    output += 'bw';
                    if (set.dropSet.bodyWeightModifier) {
                        output += `${set.dropSet.bodyWeightModifier.operation}${set.dropSet.bodyWeightModifier.value}`;
                    }
                }
                else {
                    output += `${set.dropSet.value}${set.dropSet.modifier ? set.dropSet.modifier : ''}`;
                }
                output += ` x ${set.dropSet.reps}`;
            }
            if (set.negatives) {
                output += ` x ${set.negatives} negatives`;
            }
            output += '\n';
        }
        return output;
    }
}
exports.WorkoutParser = WorkoutParser;
