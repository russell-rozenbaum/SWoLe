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
class WorkoutParser {
    constructor() {
        const grammarPath = path.join(__dirname, 'workout.pegjs');
        const grammar = fs.readFileSync(grammarPath, 'utf-8');
        this.parser = pegjs.generate(grammar);
    }
    parse(input) {
        try {
            const result = this.parser.parse(input);
            return {
                date: result.date,
                location: result.location,
                type: result.type,
                note: result.note,
                blocks: result.blocks
            };
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Parsing error: ${error.message}`);
            }
            throw error;
        }
    }
    // Helper method to validate exercise syntax
    validateExercise(exercise) {
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
    formatWorkout(workout) {
        let output = '';
        // Format date
        const date = workout.date;
        output += `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}\n`;
        // Format metadata
        output += `@${workout.location}:${workout.type}\n`;
        // Format note if present
        if (workout.note) {
            output += `${workout.note}\n`;
        }
        // Format exercises
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
    formatExercise(exercise, indent = 0) {
        const padding = ' '.repeat(indent);
        let output = `${padding}${exercise.prefix ? exercise.prefix + ' ' : ''}${exercise.name}\n`;
        for (const set of exercise.sets) {
            output += `${padding}${set.weight.value}${set.weight.modifier || ''} x ${set.reps}`;
            if (set.failureNotes) {
                output += ` F${set.failureNotes.join(',')}`;
            }
            if (set.dropSet) {
                output += ` -> ${set.dropSet.value}${set.dropSet.modifier || ''} x ${set.dropSet.reps}`;
            }
            if (set.negatives) {
                output += ` x ${set.negatives} negative${set.negatives > 1 ? 's' : ''}`;
            }
            output += '\n';
        }
        return output;
    }
}
exports.WorkoutParser = WorkoutParser;
