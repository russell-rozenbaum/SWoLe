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
app.post('/api/parse', (req, res) => {
    try {
        const { workoutText } = req.body;
        const { workout, errors } = parser.parse(workoutText);
        if (errors.length > 0) {
            res.json({
                success: false,
                errors,
                workout,
                formatted: workout ? parser.formatWorkout(workout) : ''
            });
        }
        else if (workout) {
            res.json({
                success: true,
                workout,
                formatted: parser.formatWorkout(workout)
            });
        }
        else {
            res.json({
                success: false,
                errors: [{
                        message: 'Failed to parse workout',
                        line: 1,
                        column: 1,
                        type: 'syntax'
                    }]
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            errors: [{
                    message: error instanceof Error ? error.message : 'Unknown error',
                    line: 1,
                    column: 1,
                    type: 'syntax'
                }]
        });
    }
});
// Exercise Reference API
app.get('/api/exercises', (req, res) => {
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
});
// Get unique muscle groups
app.get('/api/muscle-groups', (_req, res) => {
    const muscleGroups = new Set();
    exerciseReference_1.exerciseReference.forEach(ex => {
        ex.muscleGroups.forEach(mg => muscleGroups.add(mg));
    });
    res.json({
        success: true,
        muscleGroups: Array.from(muscleGroups).sort()
    });
});
app.listen(port, () => {
    console.log(`WorkoutLog server running at http://localhost:${port}`);
});
