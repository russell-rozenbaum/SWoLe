import { EXERCISE_EQUIPMENT, ExerciseVariant } from '../types/exercises';
import { ExerciseType } from '../types';

describe('Exercise Validation', () => {
  test('All exercises have valid equipment types', () => {
    const validEquipmentTypes: ExerciseType[] = ['BB', 'DB', 'BW', 'Cable', 'Machine'];
    
    Object.entries(EXERCISE_EQUIPMENT).forEach(([exercise, equipment]) => {
      equipment.forEach(type => {
        expect(validEquipmentTypes).toContain(type);
      });
    });
  });

  test('Bench variants are barbell only', () => {
    const benchVariants = ['Flat Bench', 'Incline Bench', 'Decline Bench'];
    benchVariants.forEach(variant => {
      expect(EXERCISE_EQUIPMENT[variant as ExerciseVariant]).toEqual(['BB']);
    });
  });

  test('Shoulder press variants allow both barbell and dumbbell', () => {
    const shoulderVariants = ['Shoulder Press', 'Military Press', 'Overhead Press'];
    shoulderVariants.forEach(variant => {
      expect(EXERCISE_EQUIPMENT[variant as ExerciseVariant]).toEqual(['BB', 'DB']);
    });
  });

  test('Single arm exercises are dumbbell only', () => {
    const singleArmExercises = ['Single Arm Row'];
    singleArmExercises.forEach(exercise => {
      expect(EXERCISE_EQUIPMENT[exercise as ExerciseVariant]).toEqual(['DB']);
    });
  });

  test('Pull up variants are bodyweight only', () => {
    const pullUpVariants = ['Pull Ups', 'Chin Ups', 'Wide Grip Pull Ups'];
    pullUpVariants.forEach(variant => {
      expect(EXERCISE_EQUIPMENT[variant as ExerciseVariant]).toEqual(['BW']);
    });
  });

  test('Exercise validation helper functions', () => {
    // Test valid exercise with correct equipment
    expect(isValidExercise('BB', 'Flat Bench')).toBe(true);
    expect(isValidExercise('DB', 'Shoulder Press')).toBe(true);
    expect(isValidExercise('BW', 'Pull Ups')).toBe(true);
    
    // Test valid exercise with incorrect equipment
    expect(isValidExercise('DB', 'Flat Bench')).toBe(false);
    expect(isValidExercise('BB', 'Single Arm Row')).toBe(false);
    
    // Test invalid exercise names
    expect(isValidExercise('BB', 'Invalid Exercise')).toBe(false);
    expect(isValidExercise('DB', 'Not A Real Exercise')).toBe(false);
  });
});

// Helper function to validate exercises
function isValidExercise(equipment: ExerciseType, exerciseName: string): boolean {
  const variant = exerciseName as ExerciseVariant;
  if (!(variant in EXERCISE_EQUIPMENT)) {
    return false;
  }
  return EXERCISE_EQUIPMENT[variant].includes(equipment);
} 