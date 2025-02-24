import { WorkoutParser } from './parser/WorkoutParser';
import { exerciseReference } from './data/exerciseReference';
import { EXERCISE_EQUIPMENT } from './types/exercises';
import { DOCUMENTATION_TEXT } from './data/documentation';
import { Category, MuscleGroup } from './types';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';

let editor: CodeMirror.Editor;
let currentOutput = { formatted: '', json: '' };
let errorWidgets: CodeMirror.LineWidget[] = [];

// Initialize parser
const parser = new WorkoutParser();

document.addEventListener('DOMContentLoaded', () => {
    const parseButton = document.getElementById('parseButton') as HTMLButtonElement;
    const outputArea = document.getElementById('outputArea') as HTMLPreElement;
    const categoryFilter = document.getElementById('categoryFilter') as HTMLSelectElement;
    const muscleFilter = document.getElementById('muscleFilter') as HTMLSelectElement;
    const exerciseList = document.getElementById('exerciseList') as HTMLDivElement;
    const workoutInput = document.getElementById('workoutInput') as HTMLTextAreaElement;

    // Initialize CodeMirror
    editor = CodeMirror.fromTextArea(workoutInput, {
        mode: "javascript", // We'll use JS mode as base
        theme: 'monokai',
        lineNumbers: true,
        lineWrapping: true,
        tabSize: 2,
        extraKeys: {
            'Tab': 'indentMore',
            'Shift-Tab': 'indentLess'
        }
    });

    // Set initial content
    editor.setValue('01/24/2024\n');

    // Parse button click handler
    parseButton.addEventListener('click', () => {
        try {
            clearErrors();
            const workoutText = editor.getValue();
            const { workout, errors } = parser.parse(workoutText);
            
            if (errors && errors.length > 0) {
                displayErrors(errors);
                if (workout) {
                    currentOutput.formatted = parser.formatWorkout(workout);
                    currentOutput.json = JSON.stringify(workout, null, 2);
                    outputArea.textContent = currentOutput.formatted;
                }
            } else if (workout) {
                currentOutput.formatted = parser.formatWorkout(workout);
                currentOutput.json = JSON.stringify(workout, null, 2);
                outputArea.textContent = currentOutput.formatted;
            }
        } catch (error) {
            displayErrors([{
                message: error instanceof Error ? error.message : 'Unknown error',
                line: 1,
                column: 1,
                type: 'syntax'
            }]);
        }
    });

    // Filter change handlers
    categoryFilter.addEventListener('change', loadExercises);
    muscleFilter.addEventListener('change', loadExercises);

    // Initialize muscle groups
    const muscleGroups = new Set<MuscleGroup>();
    exerciseReference.forEach(ex => {
        ex.muscleGroups.forEach(mg => muscleGroups.add(mg));
    });
    
    Array.from(muscleGroups).sort().forEach(muscle => {
        const option = document.createElement('option');
        option.value = muscle;
        option.textContent = muscle;
        muscleFilter.appendChild(option);
    });

    // Load initial exercises
    loadExercises();
});

function clearErrors() {
    editor.getAllMarks().forEach(mark => mark.clear());
    errorWidgets.forEach(widget => widget.clear());
    errorWidgets = [];
    for (let i = 0; i < editor.lineCount(); i++) {
        editor.removeLineClass(i, 'background', 'error-line');
    }
}

function displayErrors(errors: any[]) {
    clearErrors();
    
    errors.forEach(error => {
        const line = error.line - 1;
        const col = error.column - 1;
        
        // Add error line highlight
        editor.addLineClass(line, 'background', 'error-line');
        
        // Add error underline if we have column information
        if (col >= 0) {
            const lineText = editor.getLine(line);
            const endCol = error.found ? col + error.found.length : lineText.length;
            const from = { line, ch: col };
            const to = { line, ch: endCol };
            editor.markText(from, to, { className: 'error-underline' });
        }
        
        // Add error message widget
        const msg = document.createElement('div');
        msg.className = 'error-widget';
        msg.textContent = error.message;
        if (error.expected) {
            msg.textContent += `\nExpected: ${error.expected.join(', ')}`;
        }
        errorWidgets.push(editor.addLineWidget(line, msg));
    });
}

function loadExercises() {
    const category = (document.getElementById('categoryFilter') as HTMLSelectElement).value as Category;
    const muscleGroup = (document.getElementById('muscleFilter') as HTMLSelectElement).value as MuscleGroup;
    const exerciseList = document.getElementById('exerciseList') as HTMLDivElement;
    
    let filteredExercises = [...exerciseReference];
    
    if (category) {
        filteredExercises = filteredExercises.filter(ex => ex.category === category);
    }
    
    if (muscleGroup) {
        filteredExercises = filteredExercises.filter(ex => ex.muscleGroups.includes(muscleGroup));
    }
    
    exerciseList.innerHTML = filteredExercises.map(exercise => `
        <div class="exercise-card" onclick="insertExerciseTemplate(\`${exercise.equipment[0]} ${exercise.name}\n${exercise.template}\`)">
            <div class="flex justify-between items-start">
                <h3 class="font-semibold text-lg text-white">${exercise.name}</h3>
                <span class="weight-type-badge weight-type-${exercise.weightType}">
                    ${exercise.weightType}
                </span>
            </div>
            <div class="mt-2">
                <span class="inline-block px-2 py-1 text-sm rounded bg-red-900 text-red-100 mr-2">
                    ${exercise.category}
                </span>
                ${exercise.equipment.map(eq => `
                    <span class="inline-block px-2 py-1 text-sm rounded bg-gray-800 text-gray-100 mr-2">
                        ${eq}
                    </span>
                `).join('')}
            </div>
            <div class="mt-2">
                ${exercise.muscleGroups.map(muscle => `
                    <span class="inline-block px-2 py-1 text-sm rounded bg-yellow-900 text-yellow-100 mr-2 mb-2">
                        ${muscle}
                    </span>
                `).join('')}
            </div>
            <p class="text-sm text-gray-300 mt-2">${exercise.description || ''}</p>
        </div>
    `).join('');
}

// Make insertExerciseTemplate available globally
(window as any).insertExerciseTemplate = (template: string) => {
    let cursor = editor.getCursor();
    let line = editor.getLine(cursor.line);
    
    // If we're not at the start of a line and the current line isn't empty,
    // insert a newline first
    if (cursor.ch !== 0 || line !== '') {
        if (line === '') {
            editor.replaceRange(template, cursor);
        } else {
            editor.replaceRange('\n' + template, cursor);
        }
    } else {
        editor.replaceRange(template, cursor);
    }
}; 