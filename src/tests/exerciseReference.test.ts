import { exerciseReference } from '../data/exerciseReference';
import { ExerciseType, WeightType } from '../types';

describe('Exercise Reference Tests', () => {
  test('All exercises have required properties', () => {
    exerciseReference.forEach(exercise => {
      expect(exercise).toHaveProperty('name');
      expect(exercise).toHaveProperty('category');
      expect(exercise).toHaveProperty('muscleGroups');
      expect(exercise).toHaveProperty('equipment');
      expect(exercise).toHaveProperty('weightType');
      expect(exercise).toHaveProperty('description');
      expect(exercise).toHaveProperty('template');
    });
  });

  test('Exercise templates match their equipment type', () => {
    exerciseReference.forEach(exercise => {
      const template = exercise.template || '';
      const equipment = exercise.equipment[0];
      expect(template.startsWith(equipment)).toBeTruthy();
    });
  });

  test('Bodyweight exercises have correct weight type', () => {
    exerciseReference
      .filter(ex => ex.equipment.includes('BW' as ExerciseType))
      .forEach(exercise => {
        expect(['bodyweight', 'both'] as WeightType[]).toContain(exercise.weightType);
        expect(exercise.template).toContain('bw x ?');
      });
  });

  test('Weighted exercises have correct template format', () => {
    exerciseReference
      .filter(ex => ex.weightType === 'weighted')
      .forEach(exercise => {
        const template = exercise.template || '';
        if (exercise.equipment.includes('DB' as ExerciseType)) {
          expect(template).toContain('?ea x ?');
        } else {
          expect(template).toContain('? x ?');
        }
      });
  });

  test('Exercise names are unique', () => {
    const names = exerciseReference.map(ex => ex.name);
    const uniqueNames = new Set(names);
    expect(names.length).toBe(uniqueNames.size);
  });

  test('Exercise templates are valid', () => {
    exerciseReference.forEach(exercise => {
      const template = exercise.template || '';
      expect(template).toContain('\n');
      expect(template.split('\n')[1]).toContain('x ?');
      if (exercise.weightType === 'bodyweight') {
        expect(template).toContain('bw x ?');
      }
      if (exercise.equipment.includes('DB' as ExerciseType)) {
        expect(template).toContain('ea x ?');
      }
    });
  });

  test('Both type exercises have correct template variations', () => {
    exerciseReference
      .filter(ex => ex.weightType === 'both')
      .forEach(exercise => {
        expect(exercise.template).toContain('bw x ?');
        expect(exercise.equipment).toContain('BW' as ExerciseType);
      });
  });
}); 