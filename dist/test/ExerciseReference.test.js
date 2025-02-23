import { jsx as _jsx } from "react/jsx-runtime";
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import ExerciseReference from '../components/ExerciseReference';
describe('ExerciseReference', () => {
    beforeEach(() => {
        render(_jsx(ExerciseReference, {}));
    });
    test('renders exercise reference title', () => {
        expect(screen.getByText('Exercise Reference')).toBeInTheDocument();
    });
    test('filters exercises by category', () => {
        const select = screen.getByRole('combobox');
        // Test Push exercises
        fireEvent.change(select, { target: { value: 'Push' } });
        expect(screen.getByText('Flat Bench')).toBeInTheDocument();
        expect(screen.getByText('DB Incline Press')).toBeInTheDocument();
        expect(screen.queryByText('Sumo DL')).not.toBeInTheDocument();
        // Test Pull exercises
        fireEvent.change(select, { target: { value: 'Pull' } });
        expect(screen.getByText('VBar Rows')).toBeInTheDocument();
        expect(screen.getByText('Cable Curls')).toBeInTheDocument();
        expect(screen.queryByText('Flat Bench')).not.toBeInTheDocument();
        // Test Legs exercises
        fireEvent.change(select, { target: { value: 'Legs' } });
        expect(screen.getByText('Sumo DL')).toBeInTheDocument();
        expect(screen.getByText('Single Leg Lunges')).toBeInTheDocument();
        expect(screen.queryByText('Flat Bench')).not.toBeInTheDocument();
    });
    test('filters exercises by search term', () => {
        const searchInput = screen.getByPlaceholderText('Search exercises or muscle groups...');
        // Search by exercise name
        fireEvent.change(searchInput, { target: { value: 'Bench' } });
        expect(screen.getByText('Flat Bench')).toBeInTheDocument();
        expect(screen.queryByText('Sumo DL')).not.toBeInTheDocument();
        // Search by muscle group
        fireEvent.change(searchInput, { target: { value: 'Triceps' } });
        expect(screen.getByText('BB Skullcrushers')).toBeInTheDocument();
        expect(screen.getByText('Tricep PDs')).toBeInTheDocument();
        expect(screen.queryByText('Sumo DL')).not.toBeInTheDocument();
    });
    test('shows all exercises when category is All', () => {
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'All' } });
        expect(screen.getByText('Flat Bench')).toBeInTheDocument();
        expect(screen.getByText('VBar Rows')).toBeInTheDocument();
        expect(screen.getByText('Sumo DL')).toBeInTheDocument();
    });
    test('displays muscle groups for each exercise', () => {
        expect(screen.getByText('Chest, Triceps, Front Deltoids')).toBeInTheDocument(); // For Flat Bench
        expect(screen.getByText('Hamstrings, Glutes, Lower Back')).toBeInTheDocument(); // For Sumo DL
    });
});
//# sourceMappingURL=ExerciseReference.test.js.map