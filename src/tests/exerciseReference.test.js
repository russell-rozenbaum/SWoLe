"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exerciseReference_1 = require("../data/exerciseReference");
describe('Exercise Reference Tests', () => {
    test('All exercises have required properties', () => {
        exerciseReference_1.exerciseReference.forEach(exercise => {
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
        exerciseReference_1.exerciseReference.forEach(exercise => {
            const template = exercise.template || '';
            const equipment = exercise.equipment[0];
            expect(template.startsWith(equipment)).toBeTruthy();
        });
    });
    test('Bodyweight exercises have correct weight type', () => {
        exerciseReference_1.exerciseReference
            .filter(ex => ex.equipment.includes('BW'))
            .forEach(exercise => {
            expect(['bodyweight', 'both']).toContain(exercise.weightType);
            expect(exercise.template).toContain('bw x ?');
        });
    });
    test('Weighted exercises have correct template format', () => {
        exerciseReference_1.exerciseReference
            .filter(ex => ex.weightType === 'weighted')
            .forEach(exercise => {
            const template = exercise.template || '';
            if (exercise.equipment.includes('DB')) {
                expect(template).toContain('?ea x ?');
            }
            else {
                expect(template).toContain('? x ?');
            }
        });
    });
    test('Exercise names are unique', () => {
        const names = exerciseReference_1.exerciseReference.map(ex => ex.name);
        const uniqueNames = new Set(names);
        expect(names.length).toBe(uniqueNames.size);
    });
    test('Exercise templates are valid', () => {
        exerciseReference_1.exerciseReference.forEach(exercise => {
            const template = exercise.template || '';
            expect(template).toContain('\n');
            expect(template.split('\n')[1]).toContain('x ?');
            if (exercise.weightType === 'bodyweight') {
                expect(template).toContain('bw x ?');
            }
            if (exercise.equipment.includes('DB')) {
                expect(template).toContain('ea x ?');
            }
        });
    });
    test('Both type exercises have correct template variations', () => {
        exerciseReference_1.exerciseReference
            .filter(ex => ex.weightType === 'both')
            .forEach(exercise => {
            expect(exercise.template).toContain('bw x ?');
            expect(exercise.equipment).toContain('BW');
        });
    });
});
