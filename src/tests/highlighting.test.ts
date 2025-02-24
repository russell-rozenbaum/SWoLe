import { ExerciseType } from '../types';
import { EXERCISE_EQUIPMENT, ExerciseVariant } from '../types/exercises';

describe('Exercise Name Validation Tests', () => {
  // Helper function to simulate the CodeMirror validation logic
  function isValidExercise(prefix: ExerciseType | undefined, fullName: string): boolean {
    if (!prefix || !fullName) return false;
    
    const name = fullName.toLowerCase().trim();
    const variants = Object.keys(EXERCISE_EQUIPMENT) as ExerciseVariant[];
    
    // Try exact match first
    const exactMatch = variants.find(v => v.toLowerCase() === name);
    if (exactMatch) {
      return EXERCISE_EQUIPMENT[exactMatch].includes(prefix);
    }
    
    // Try matching with normalized names (remove hyphens, handle spaces)
    const normalizedName = name.replace(/[-\s]+/g, ' ');
    const normalizedMatch = variants.find(v => 
      v.toLowerCase().replace(/[-\s]+/g, ' ') === normalizedName
    );
    if (normalizedMatch) {
      return EXERCISE_EQUIPMENT[normalizedMatch].includes(prefix);
    }
    
    // Try partial matches with word-by-word comparison
    const nameWords = normalizedName.split(' ').filter(w => w.length > 0);
    const matches = variants.filter(v => {
      const variantNormalized = v.toLowerCase().replace(/[-\s]+/g, ' ');
      const variantWords = variantNormalized.split(' ');
      
      // Check if all words in the name appear in the variant in order
      let lastFoundIndex = -1;
      return nameWords.every(word => {
        const index = variantWords.findIndex((vw, i) => i > lastFoundIndex && vw === word);
        if (index === -1) return false;
        lastFoundIndex = index;
        return true;
      });
    });
    
    return matches.some(match => EXERCISE_EQUIPMENT[match].includes(prefix));
  }

  describe('Bench Press Variations', () => {
    test('validates BB Bench Press correctly', () => {
      expect(isValidExercise('BB', 'Bench Press')).toBe(true);
      expect(isValidExercise('BB', 'Flat Bench')).toBe(true);
      expect(isValidExercise('BB', 'Incline Bench')).toBe(true);
      expect(isValidExercise('BB', 'Decline Bench')).toBe(true);
    });

    test('validates DB Bench Press correctly', () => {
      expect(isValidExercise('DB', 'Bench Press')).toBe(false);
      expect(isValidExercise('DB', 'Flat Bench')).toBe(false);
      expect(isValidExercise('DB', 'Incline Bench')).toBe(false);
      expect(isValidExercise('DB', 'Decline Bench')).toBe(false);
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

  describe('Tricep Exercise Validation', () => {
    test('validates Skullcrushers with different equipment', () => {
      expect(isValidExercise('BB', 'Skullcrushers')).toBe(true);
      expect(isValidExercise('DB', 'Skullcrushers')).toBe(true);
      expect(isValidExercise('Cable', 'Skullcrushers')).toBe(false);
    });

    test('validates Skullcrushers with different spellings', () => {
      expect(isValidExercise('BB', 'Skull Crushers')).toBe(true);
      expect(isValidExercise('BB', 'Skull-Crushers')).toBe(true);
      expect(isValidExercise('BB', 'skullcrushers')).toBe(true);
      expect(isValidExercise('BB', 'SKULLCRUSHERS')).toBe(true);
    });

    test('validates Tricep Pushdown variations', () => {
      expect(isValidExercise('Cable', 'Tricep Pushdown')).toBe(true);
      expect(isValidExercise('Cable', 'Tricep Push Down')).toBe(true);
      expect(isValidExercise('Cable', 'Tricep-Pushdown')).toBe(true);
      expect(isValidExercise('Cable', 'Pushdown')).toBe(true);
      expect(isValidExercise('Cable', 'Rope Pushdown')).toBe(true);
    });
  });

  describe('Case Sensitivity Tests', () => {
    test('validates exercises regardless of case', () => {
      expect(isValidExercise('BB', 'BENCH PRESS')).toBe(true);
      expect(isValidExercise('BB', 'bench press')).toBe(true);
      expect(isValidExercise('BB', 'Bench Press')).toBe(true);
      expect(isValidExercise('DB', 'SKULL CRUSHERS')).toBe(true);
      expect(isValidExercise('DB', 'skull crushers')).toBe(true);
      expect(isValidExercise('DB', 'Skull Crushers')).toBe(true);
    });
  });

  describe('Equipment Validation', () => {
    test('validates correct equipment for exercises', () => {
      expect(isValidExercise('BB', 'Bench Press')).toBe(true);
      expect(isValidExercise('DB', 'Bench Press')).toBe(true);
      expect(isValidExercise('BW', 'Bench Press')).toBe(false);
      expect(isValidExercise('BB', 'Pull Ups')).toBe(false);
      expect(isValidExercise('BW', 'Pull Ups')).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('handles undefined and empty inputs', () => {
      expect(isValidExercise(undefined, 'Bench Press')).toBe(false);
      expect(isValidExercise('BB', '')).toBe(false);
      expect(isValidExercise(undefined, '')).toBe(false);
    });

    test('handles extra whitespace', () => {
      expect(isValidExercise('BB', '  Bench   Press  ')).toBe(true);
      expect(isValidExercise('DB', '  Skull   Crushers  ')).toBe(true);
    });
  });
}); 