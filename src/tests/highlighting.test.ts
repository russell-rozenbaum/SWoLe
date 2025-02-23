import { ExerciseType } from '../types';
import { EXERCISE_EQUIPMENT, ExerciseVariant } from '../types/exercises';

describe('Exercise Name Validation Tests', () => {
  // Helper function to simulate the CodeMirror validation logic
  function isValidExercise(prefix: ExerciseType | undefined, fullName: string): boolean {
    if (!prefix || !fullName) return false;
    
    const variants = Object.keys(EXERCISE_EQUIPMENT) as ExerciseVariant[];
    const name = fullName.toLowerCase().trim();
    
    // Try exact match first
    const exactMatch = variants.find(v => 
      v.toLowerCase() === name
    );
    
    if (exactMatch && EXERCISE_EQUIPMENT[exactMatch].includes(prefix)) {
      return true;
    }
    
    // Try partial matches, but only if they uniquely identify an exercise
    const partialMatches = variants.filter(v => {
      const variant = v.toLowerCase();
      return variant.includes(name) || name.includes(variant);
    });
    
    // If we have exactly one match and it supports this equipment type, it's valid
    if (partialMatches.length === 1 && EXERCISE_EQUIPMENT[partialMatches[0]].includes(prefix)) {
      return true;
    }
    
    // Try each word combination from largest to smallest
    const words = name.split(/\s+/);
    for (let i = words.length; i > 0; i--) {
      const possibleName = words.slice(0, i).join(' ');
      const matchingVariants = variants.filter(v => {
        const variant = v.toLowerCase();
        return variant === possibleName || 
               variant.includes(possibleName) || 
               possibleName.includes(variant);
      });
      
      // Only consider it a match if we have exactly one variant and it supports this equipment
      if (matchingVariants.length === 1 && EXERCISE_EQUIPMENT[matchingVariants[0]].includes(prefix)) {
        return true;
      }
    }
    
    return false;
  }

  describe('Bench Press Variations', () => {
    test('validates BB Bench Press correctly', () => {
      expect(isValidExercise('BB', 'Bench Press')).toBe(true);
      expect(isValidExercise('BB', 'Flat Bench')).toBe(true);
      expect(isValidExercise('BB', 'Incline Bench')).toBe(true);
      expect(isValidExercise('BB', 'Decline Bench')).toBe(true);
    });

    test('validates DB Bench Press correctly', () => {
      expect(isValidExercise('DB', 'Bench Press')).toBe(true);
      expect(isValidExercise('DB', 'Flat Bench')).toBe(true);
      expect(isValidExercise('DB', 'Incline Bench')).toBe(true);
      expect(isValidExercise('DB', 'Decline Bench')).toBe(true);
    });
  });

  describe('Shoulder Press Variations', () => {
    test('validates BB Shoulder Press correctly', () => {
      expect(isValidExercise('BB', 'Shoulder Press')).toBe(true);
      expect(isValidExercise('BB', 'Military Press')).toBe(true);
      expect(isValidExercise('BB', 'Overhead Press')).toBe(true);
    });

    test('validates DB Shoulder Press correctly', () => {
      expect(isValidExercise('DB', 'Shoulder Press')).toBe(true);
      expect(isValidExercise('DB', 'Military Press')).toBe(true);
      expect(isValidExercise('DB', 'Overhead Press')).toBe(true);
    });
  });

  describe('Row Variations', () => {
    test('validates BB Row correctly', () => {
      expect(isValidExercise('BB', 'Row')).toBe(true);
      expect(isValidExercise('BB', 'Bent Over Row')).toBe(true);
    });

    test('validates DB Row correctly', () => {
      expect(isValidExercise('DB', 'Row')).toBe(true);
      expect(isValidExercise('DB', 'Bent Over Row')).toBe(true);
      expect(isValidExercise('DB', 'Single Arm Row')).toBe(true);
    });
  });

  describe('Curl Variations', () => {
    test('validates BB Curl correctly', () => {
      expect(isValidExercise('BB', 'Curl')).toBe(true);
      expect(isValidExercise('BB', 'Bicep Curl')).toBe(true);
      expect(isValidExercise('BB', 'EZ Bar Curl')).toBe(true);
    });

    test('validates DB Curl correctly', () => {
      expect(isValidExercise('DB', 'Curl')).toBe(true);
      expect(isValidExercise('DB', 'Bicep Curl')).toBe(true);
      expect(isValidExercise('DB', 'Hammer Curl')).toBe(true);
    });
  });

  describe('Squat Variations', () => {
    test('validates BB Squat correctly', () => {
      expect(isValidExercise('BB', 'Squat')).toBe(true);
      expect(isValidExercise('BB', 'Back Squat')).toBe(true);
      expect(isValidExercise('BB', 'Front Squat')).toBe(true);
    });

    test('validates BW Squat correctly', () => {
      expect(isValidExercise('BW', 'Squat')).toBe(true);
      expect(isValidExercise('BW', 'Bodyweight Squat')).toBe(true);
    });
  });

  describe('Pull Up Variations', () => {
    test('validates BW Pull Up variations correctly', () => {
      expect(isValidExercise('BW', 'Pull Ups')).toBe(true);
      expect(isValidExercise('BW', 'Chin Ups')).toBe(true);
      expect(isValidExercise('BW', 'Wide Grip Pull Ups')).toBe(true);
    });

    test('rejects non-BW Pull Up variations', () => {
      expect(isValidExercise('BB', 'Pull Ups')).toBe(false);
      expect(isValidExercise('DB', 'Pull Ups')).toBe(false);
    });
  });

  describe('Invalid Exercise Combinations', () => {
    test('rejects invalid exercise names', () => {
      expect(isValidExercise('BB', 'Invalid Exercise')).toBe(false);
      expect(isValidExercise('DB', 'Not A Real Exercise')).toBe(false);
      expect(isValidExercise('BW', 'Made Up Exercise')).toBe(false);
    });

    test('rejects invalid equipment combinations', () => {
      expect(isValidExercise('BW', 'Bench Press')).toBe(false);
      expect(isValidExercise('BB', 'Hammer Curl')).toBe(false);
      expect(isValidExercise('DB', 'Front Squat')).toBe(false);
    });

    test('handles undefined/empty inputs', () => {
      expect(isValidExercise(undefined, 'Bench Press')).toBe(false);
      expect(isValidExercise('BB', '')).toBe(false);
      expect(isValidExercise(undefined, '')).toBe(false);
    });
  });
}); 