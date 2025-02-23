"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const WorkoutParser_1 = require("./parser/WorkoutParser");
const exerciseReference_1 = require("./data/exerciseReference");
const app = (0, express_1.default)();
const port = 3000;
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// Initialize parser
const parser = new WorkoutParser_1.WorkoutParser();
// API Routes
const parseWorkout = (req, res) => {
    try {
        // Check if we have a request body
        if (!req.body || (typeof req.body !== 'object')) {
            res.status(400).json({
                success: false,
                error: 'Invalid request format. Expected JSON body.'
            });
            return;
        }
        // Get workout text from either key
        const workoutText = req.body.workoutText || req.body.workout;
        if (!workoutText || typeof workoutText !== 'string') {
            res.status(400).json({
                success: false,
                error: 'No workout text provided. Please enter a workout to parse.'
            });
            return;
        }
        console.log('Parsing workout text:', workoutText); // Debug log
        console.log('Workout text length:', workoutText.length);
        console.log('Workout text lines:', workoutText.split('\n').length);
        console.log('Workout text lines:', workoutText.split('\n'));
        const workout = parser.parse(workoutText);
        console.log('Parsed workout:', workout); // Debug log
        res.json({
            success: true,
            workout,
            formatted: parser.formatWorkout(workout)
        });
    }
    catch (error) {
        console.error('Parse error:', error); // Debug log
        let errorMessage = 'Failed to parse workout';
        if (error instanceof Error) {
            // Extract the useful part of the PEG.js error message
            const pegMatch = error.message.match(/Expected .+ but .+ found/);
            if (pegMatch) {
                errorMessage = `Syntax error: ${pegMatch[0]}. Please check the documentation for correct syntax.`;
            }
            else if (error.message.includes('is not defined')) {
                // Handle reference errors more gracefully
                const lineMatch = error.message.match(/line (\d+)/);
                const line = lineMatch ? parseInt(lineMatch[1]) : null;
                errorMessage = line
                    ? `Invalid format at line ${line}. Please check the documentation for correct syntax.`
                    : 'Invalid workout format. Please check the documentation for correct syntax.';
            }
            else {
                errorMessage = `Parser error: ${error.message}. Please check the documentation for correct syntax.`;
            }
        }
        // Log the detailed error for debugging
        console.error('Detailed error:', {
            originalError: error,
            friendlyMessage: errorMessage
        });
        res.status(400).json({
            success: false,
            error: errorMessage
        });
    }
};
const getExercises = (req, res) => {
    const { category, muscleGroup } = req.query;
    let filteredExercises = [...exerciseReference_1.exerciseReference];
    if (category) {
        filteredExercises = filteredExercises.filter(ex => ex.category === category);
    }
    if (muscleGroup) {
        filteredExercises = filteredExercises.filter(ex => ex.muscleGroups.includes(muscleGroup));
    }
    res.json({
        success: true,
        exercises: filteredExercises
    });
};
const getMuscleGroups = (_req, res) => {
    const muscleGroups = new Set();
    exerciseReference_1.exerciseReference.forEach(ex => {
        ex.muscleGroups.forEach(mg => muscleGroups.add(mg));
    });
    res.json({
        success: true,
        muscleGroups: Array.from(muscleGroups).sort()
    });
};
// Register routes
app.post('/api/parse', parseWorkout);
app.get('/api/exercises', getExercises);
app.get('/api/muscle-groups', getMuscleGroups);
app.listen(port, () => {
    console.log(`SWoLe server running at http://localhost:${port}`);
});
