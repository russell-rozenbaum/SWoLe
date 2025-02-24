import express from 'express';
import path from 'path';
import { WorkoutParser } from './parser/WorkoutParser';
import { exerciseReference } from './data/exerciseReference';
import { Category, MuscleGroup, ExerciseType } from './types';
import { EXERCISE_EQUIPMENT } from './types/exercises';
import { DOCUMENTATION_TEXT } from './data/documentation';
import { initializeDatabase } from './db/init';
import { createUser, authenticateUser, UserCredentials } from './db/userService';
import { saveWorkoutFile, getUserWorkoutFiles, getWorkoutFile, deleteWorkoutFile } from './db/workoutFileService';
import { authenticateToken, AuthRequest } from './middleware/auth';
import { getUserById } from './db/userService';

const app = express();
const port = process.env.PORT || 3000;

// Initialize database
initializeDatabase().catch(console.error);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Initialize parser
const parser = new WorkoutParser();

// Auth routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const credentials: UserCredentials = req.body;
        const user = await createUser(credentials);
        res.status(201).json({ success: true, user });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error instanceof Error ? error.message : 'Registration failed'
        });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const credentials: UserCredentials = req.body;
        const token = await authenticateUser(credentials);
        res.json({ success: true, token });
    } catch (error) {
        res.status(401).json({
            success: false,
            error: error instanceof Error ? error.message : 'Authentication failed'
        });
    }
});

// Workout file routes
app.post('/api/files', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const { filename, content, update } = req.body;
        const userId = req.user!.userId;

        // First verify that the user exists
        try {
            await getUserById(userId);
        } catch (error) {
            console.error('User verification failed:', error);
            return res.status(401).json({
                success: false,
                error: 'Invalid user. Please log out and log in again.'
            });
        }

        try {
            const file = await saveWorkoutFile(userId, filename, content, update);
            res.status(201).json({ success: true, file });
        } catch (error) {
            if (error instanceof Error && error.message.includes('UNIQUE constraint')) {
                res.status(409).json({
                    success: false,
                    error: error.message
                });
            } else {
                console.error('Error saving file:', error);
                res.status(500).json({
                    success: false,
                    error: 'Failed to save file'
                });
            }
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({
            success: false,
            error: 'An unexpected error occurred'
        });
    }
});

app.get('/api/files', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userId = req.user!.userId;
        const files = await getUserWorkoutFiles(userId);
        res.json({ success: true, files });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch files'
        });
    }
});

app.get('/api/files/:id', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userId = req.user!.userId;
        const fileId = parseInt(req.params.id);
        const file = await getWorkoutFile(userId, fileId);
        res.json({ success: true, file });
    } catch (error) {
        res.status(404).json({
            success: false,
            error: error instanceof Error ? error.message : 'File not found'
        });
    }
});

app.delete('/api/files/:id', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userId = req.user!.userId;
        const fileId = parseInt(req.params.id);
        await deleteWorkoutFile(userId, fileId);
        res.json({ success: true });
    } catch (error) {
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
  res.sendFile(path.join(__dirname, '../public/index.html'));
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
    } else if (workout) {
      res.json({
        success: true,
        workout,
        formatted: parser.formatWorkout(workout)
      });
    } else {
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
  } catch (error) {
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
  
  let filteredExercises = [...exerciseReference];
  
  if (category) {
    filteredExercises = filteredExercises.filter(
      ex => ex.category === category as Category
    );
  }
  
  if (muscleGroup) {
    filteredExercises = filteredExercises.filter(
      ex => ex.muscleGroups.includes(muscleGroup as MuscleGroup)
    );
  }
  
  res.json({
    success: true,
    exercises: filteredExercises
  });
});

// Get unique muscle groups
app.get('/api/muscle-groups', (_req, res) => {
  const muscleGroups = new Set<MuscleGroup>();
  exerciseReference.forEach(ex => {
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
  const validationData: Record<string, ExerciseType[]> = {};
  
  // Add all variants from EXERCISE_EQUIPMENT
  Object.entries(EXERCISE_EQUIPMENT).forEach(([variant, equipment]) => {
    validationData[variant] = equipment;
  });
  
  // Add all variants from exerciseReference
  exerciseReference.forEach(exercise => {
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
  res.type('text/plain').send(DOCUMENTATION_TEXT);
});

app.listen(port, () => {
  console.log(`WorkoutLog server running at http://localhost:${port}`);
}); 