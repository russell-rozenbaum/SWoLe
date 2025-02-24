"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const WorkoutParser_1 = require("./parser/WorkoutParser");
const exerciseReference_1 = require("./data/exerciseReference");
const exercises_1 = require("./types/exercises");
const documentation_1 = require("./data/documentation");
const init_1 = require("./db/init");
const userService_1 = require("./db/userService");
const workoutFileService_1 = require("./db/workoutFileService");
const auth_1 = require("./middleware/auth");
const userService_2 = require("./db/userService");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Initialize database
(0, init_1.initializeDatabase)().catch(console.error);
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// Initialize parser
const parser = new WorkoutParser_1.WorkoutParser();
// Auth routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const credentials = req.body;
        const user = await (0, userService_1.createUser)(credentials);
        res.status(201).json({ success: true, user });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error instanceof Error ? error.message : 'Registration failed'
        });
    }
});
app.post('/api/auth/login', async (req, res) => {
    try {
        const credentials = req.body;
        const token = await (0, userService_1.authenticateUser)(credentials);
        res.json({ success: true, token });
    }
    catch (error) {
        res.status(401).json({
            success: false,
            error: error instanceof Error ? error.message : 'Authentication failed'
        });
    }
});
// Workout file routes
app.post('/api/files', auth_1.authenticateToken, async (req, res) => {
    try {
        const { filename, content, update } = req.body;
        const userId = req.user.userId;
        // First verify that the user exists
        try {
            await (0, userService_2.getUserById)(userId);
        }
        catch (error) {
            console.error('User verification failed:', error);
            return res.status(401).json({
                success: false,
                error: 'Invalid user. Please log out and log in again.'
            });
        }
        try {
            const file = await (0, workoutFileService_1.saveWorkoutFile)(userId, filename, content, update);
            res.status(201).json({ success: true, file });
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('UNIQUE constraint')) {
                res.status(409).json({
                    success: false,
                    error: error.message
                });
            }
            else {
                console.error('Error saving file:', error);
                res.status(500).json({
                    success: false,
                    error: 'Failed to save file'
                });
            }
        }
    }
    catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({
            success: false,
            error: 'An unexpected error occurred'
        });
    }
});
app.get('/api/files', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const files = await (0, workoutFileService_1.getUserWorkoutFiles)(userId);
        res.json({ success: true, files });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch files'
        });
    }
});
app.get('/api/files/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const fileId = parseInt(req.params.id);
        const file = await (0, workoutFileService_1.getWorkoutFile)(userId, fileId);
        res.json({ success: true, file });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            error: error instanceof Error ? error.message : 'File not found'
        });
    }
});
app.delete('/api/files/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const fileId = parseInt(req.params.id);
        await (0, workoutFileService_1.deleteWorkoutFile)(userId, fileId);
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete file'
        });
    }
});
// Serve index.html for all routes (for GitHub Pages SPA support)
app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api')) {
        next();
        return;
    }
    res.sendFile(path_1.default.join(__dirname, '../public/index.html'));
});
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
// Add new endpoint for exercise validation data
app.get('/api/exercise-validation', (_req, res) => {
    // Create a map of exercise variants to their allowed equipment types
    const validationData = {};
    // Add all variants from EXERCISE_EQUIPMENT
    Object.entries(exercises_1.EXERCISE_EQUIPMENT).forEach(([variant, equipment]) => {
        validationData[variant] = equipment;
    });
    // Add all variants from exerciseReference
    exerciseReference_1.exerciseReference.forEach(exercise => {
        exercise.variations.forEach(variant => {
            if (!validationData[variant]) {
                validationData[variant] = exercise.equipment;
            }
        });
    });
    res.json({
        success: true,
        exerciseEquipment: validationData
    });
});
// Add new endpoint for documentation
app.get('/api/documentation', (_req, res) => {
    res.type('text/plain').send(documentation_1.DOCUMENTATION_TEXT);
});
app.listen(port, () => {
    console.log(`WorkoutLog server running at http://localhost:${port}`);
});
