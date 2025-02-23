import express from 'express';
import path from 'path';
import { WorkoutParser } from './parser/WorkoutParser';
import { exerciseReference } from './data/exerciseReference';
import { Category, MuscleGroup } from './types';
import { EXERCISE_EQUIPMENT } from './types/exercises';

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Initialize parser
const parser = new WorkoutParser();

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
  res.json({
    success: true,
    exerciseEquipment: EXERCISE_EQUIPMENT
  });
});

app.listen(port, () => {
  console.log(`WorkoutLog server running at http://localhost:${port}`);
}); 