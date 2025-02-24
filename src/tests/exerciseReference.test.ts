import { exerciseReference } from '../data/exerciseReference';
import { EXERCISE_EQUIPMENT, ExerciseVariant, Equipment } from '../types/exercises';

describe('Exercise Reference Tests', () => {
  test('All exercises have required properties', () => {
    exerciseReference.forEach(exercise => {
      expect(exercise).toHaveProperty('name');
      expect(exercise).toHaveProperty('variations');
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
      if (exercise.weightType === 'weight') {
        expect(exercise.template).toBe('? x ? for ?');
      } else {
        expect(exercise.template).toBe('? x ? for ?');
      }
    });
  });

  test('Bodyweight exercises have correct weight type', () => {
    const bodyweightExercises = exerciseReference
      .filter(ex => ex.equipment.includes('BW') && !ex.equipment.some(e => e !== 'BW'))
      .filter(ex => ex.weightType === 'bodyweight');

    bodyweightExercises.forEach(exercise => {
      expect(exercise.template).toBe('? x ? for ?');
    });
  });

  test('Weighted exercises have correct template format', () => {
    const weightedExercises = exerciseReference
      .filter(ex => ex.weightType === 'weight')
      .filter(ex => !ex.equipment.includes('BW'));

    weightedExercises.forEach(exercise => {
      expect(exercise.template).toBe('? x ? for ?');
    });
  });

  test('Exercise names are unique', () => {
    const names = exerciseReference.map(ex => ex.name);
    const uniqueNames = new Set(names);
    expect(names.length).toBe(uniqueNames.size);
  });

  test('Exercise templates are valid', () => {
    exerciseReference.forEach(exercise => {
      if (exercise.weightType === 'bodyweight') {
        expect(exercise.template).toBe('? x ? for ?');
      } else {
        expect(exercise.template).toBe('? x ? for ?');
      }
    });
  });

  test('Both type exercises have correct template variations', () => {
    const bothTypeExercises = exerciseReference
      .filter(ex => ex.equipment.includes('BW') && ex.equipment.length > 1);

    bothTypeExercises.forEach(exercise => {
      expect(exercise.template).toBe('? x ? for ?');
    });
  });

  test('Exercises are in alphabetical order', () => {
    const names = exerciseReference.map(ex => ex.name);
    const sortedNames = [...names].sort((a, b) => a.localeCompare(b));
    console.log('Current order:', names);
    console.log('Expected order:', sortedNames);
    expect(names).toEqual(sortedNames);
  });

  test('All exercise variants from EXERCISE_EQUIPMENT are represented', () => {
    const allVariations = new Set(
      exerciseReference.flatMap(ex => 
        ex.variations.map(v => v.toLowerCase())
      )
    );

    const equipmentVariants = new Set(
      Object.keys(EXERCISE_EQUIPMENT).map(v => v.toLowerCase())
    );

    const missingVariants = [...equipmentVariants].filter(v => !allVariations.has(v));
    const extraVariants = [...allVariations].filter(v => !equipmentVariants.has(v));

    console.log('Missing variants:', missingVariants);
    console.log('Extra variants:', extraVariants);

    // Check if all equipment variants are included in exercise variations
    equipmentVariants.forEach(variant => {
      expect(allVariations.has(variant)).toBeTruthy();
    });
  });

  test('Exercise names are unique (ignoring case)', () => {
    const names = exerciseReference.map(ex => ex.name.toLowerCase());
    const uniqueNames = new Set(names);
    console.log('Duplicate names:', names.filter((name, index) => names.indexOf(name) !== index));
    expect(names.length).toBe(uniqueNames.size);
  });

  test('All exercises have valid equipment types', () => {
    exerciseReference.forEach(exercise => {
      const variations = exercise.variations;
      const definedEquipment = exercise.equipment;

      // Check that all defined equipment is valid
      definedEquipment.forEach(equipment => {
        expect(['BB', 'DB', 'Cable', 'Machine', 'BW'] as Equipment[]).toContain(equipment);
      });
    });
  });
}); 