import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
const exercises = [
    // Push Exercises
    { name: 'Flat Bench', category: 'Push', muscleGroups: ['Chest', 'Triceps', 'Front Deltoids'] },
    { name: 'DB Incline Press', category: 'Push', muscleGroups: ['Upper Chest', 'Triceps', 'Front Deltoids'] },
    { name: 'BB Skullcrushers', category: 'Push', muscleGroups: ['Triceps'] },
    { name: 'DB Shoulder Flies', category: 'Push', muscleGroups: ['Lateral Deltoids'] },
    { name: 'Tricep PDs', category: 'Push', muscleGroups: ['Triceps'] },
    { name: 'Seated Chest Flies', category: 'Push', muscleGroups: ['Chest'] },
    { name: 'DB Skullcrushers', category: 'Push', muscleGroups: ['Triceps'] },
    { name: 'Cable Tricep Kickbacks', category: 'Push', muscleGroups: ['Triceps'] },
    { name: 'Shoulder Plate Raises', category: 'Push', muscleGroups: ['Front Deltoids'] },
    { name: 'Push Ups', category: 'Push', muscleGroups: ['Chest', 'Triceps', 'Front Deltoids'] },
    { name: 'DB Seated Shoulder Press', category: 'Push', muscleGroups: ['Shoulders', 'Triceps'] },
    { name: 'Cable Shoulder Flies', category: 'Push', muscleGroups: ['Lateral Deltoids'] },
    { name: 'Seated Machine Chest Press', category: 'Push', muscleGroups: ['Chest', 'Triceps'] },
    // Pull Exercises
    { name: 'VBar Rows', category: 'Pull', muscleGroups: ['Upper Back', 'Lats'] },
    { name: 'Cable Curls', category: 'Pull', muscleGroups: ['Biceps'] },
    { name: 'Seated RD Flies', category: 'Pull', muscleGroups: ['Rear Deltoids'] },
    { name: 'Lat Pulldowns', category: 'Pull', muscleGroups: ['Lats', 'Upper Back'] },
    { name: 'Cable Lat Pushdowns', category: 'Pull', muscleGroups: ['Lats'] },
    { name: 'DB Rows', category: 'Pull', muscleGroups: ['Upper Back', 'Lats'] },
    { name: 'EZ Bar Curls', category: 'Pull', muscleGroups: ['Biceps'] },
    { name: 'DB Rear Delt Flies', category: 'Pull', muscleGroups: ['Rear Deltoids'] },
    { name: 'Incline DB Curls', category: 'Pull', muscleGroups: ['Biceps'] },
    { name: 'BB Shrugs', category: 'Pull', muscleGroups: ['Traps'] },
    { name: 'Pull Ups', category: 'Pull', muscleGroups: ['Lats', 'Upper Back'] },
    { name: 'DB Curls', category: 'Pull', muscleGroups: ['Biceps'] },
    // Legs Exercises
    { name: 'Sumo DL', category: 'Legs', muscleGroups: ['Hamstrings', 'Glutes', 'Lower Back'] },
    { name: 'Single Leg Lunges', category: 'Legs', muscleGroups: ['Quads', 'Glutes'] },
    { name: 'Seated Ham Curls', category: 'Legs', muscleGroups: ['Hamstrings'] },
    { name: 'BB RDLs', category: 'Legs', muscleGroups: ['Hamstrings', 'Lower Back'] },
    { name: 'Single Leg Walking Lunges', category: 'Legs', muscleGroups: ['Quads', 'Glutes'] },
    { name: 'Hip Ab', category: 'Legs', muscleGroups: ['Hip Abductors'] },
    { name: 'Hip Ad', category: 'Legs', muscleGroups: ['Hip Adductors'] },
    { name: 'DB KOT Lunges', category: 'Legs', muscleGroups: ['Quads', 'Glutes'] },
    { name: 'Leg Press Calf Raises', category: 'Legs', muscleGroups: ['Calves'] },
    { name: 'Single Leg Bridges', category: 'Legs', muscleGroups: ['Glutes', 'Hamstrings'] },
    { name: 'Hip Flexor Raises', category: 'Legs', muscleGroups: ['Hip Flexors'] },
    { name: 'Box Jumps', category: 'Legs', muscleGroups: ['Full Leg Power'] },
    { name: 'Elevated Single Leg Calf Raises', category: 'Legs', muscleGroups: ['Calves'] },
    { name: 'DB RDLs', category: 'Legs', muscleGroups: ['Hamstrings', 'Lower Back'] },
];
const ExerciseReference = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    const filteredExercises = exercises.filter(exercise => {
        const matchesCategory = selectedCategory === 'All' || exercise.category === selectedCategory;
        const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exercise.muscleGroups.some(group => group.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
    });
    return (_jsxs("div", { className: "p-4 max-w-4xl mx-auto", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Exercise Reference" }), _jsxs("div", { className: "mb-4 flex gap-4", children: [_jsx("div", { children: _jsxs("select", { value: selectedCategory, onChange: handleCategoryChange, className: "p-2 border rounded", children: [_jsx("option", { value: "All", children: "All Categories" }), _jsx("option", { value: "Push", children: "Push" }), _jsx("option", { value: "Pull", children: "Pull" }), _jsx("option", { value: "Legs", children: "Legs" })] }) }), _jsx("div", { className: "flex-1", children: _jsx("input", { type: "text", placeholder: "Search exercises or muscle groups...", value: searchTerm, onChange: handleSearchChange, className: "w-full p-2 border rounded" }) })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: filteredExercises.map((exercise, index) => (_jsxs("div", { className: "border rounded p-4 bg-white shadow", children: [_jsx("h3", { className: "font-bold text-lg", children: exercise.name }), _jsx("div", { className: "mt-2", children: _jsx("span", { className: `inline-block px-2 py-1 rounded text-sm mr-2 ${exercise.category === 'Push' ? 'bg-blue-100 text-blue-800' :
                                    exercise.category === 'Pull' ? 'bg-green-100 text-green-800' :
                                        'bg-purple-100 text-purple-800'}`, children: exercise.category }) }), _jsx("div", { className: "mt-2", children: _jsx("p", { className: "text-sm text-gray-600", children: exercise.muscleGroups.join(', ') }) })] }, index))) })] }));
};
export default ExerciseReference;
//# sourceMappingURL=ExerciseReference.js.map