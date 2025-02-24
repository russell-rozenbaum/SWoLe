import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/mode/javascript/javascript.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize CodeMirror
    const editor = CodeMirror.fromTextArea(document.getElementById('editor') as HTMLTextAreaElement, {
        mode: 'javascript',
        theme: 'monokai',
        lineNumbers: true,
        lineWrapping: true,
        autofocus: true
    });

    // Set initial content
    editor.setValue('// Enter your workout here\n');

    // Handle Parse button click
    const parseButton = document.getElementById('parseWorkout');
    const outputDiv = document.getElementById('output');

    parseButton?.addEventListener('click', async () => {
        const workoutText = editor.getValue();
        
        try {
            const response = await fetch('/api/parse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ workoutText }),
            });

            const data = await response.json();
            
            if (outputDiv) {
                if (data.success) {
                    outputDiv.innerHTML = `<pre>${data.formatted}</pre>`;
                } else {
                    outputDiv.innerHTML = `<div class="error">${data.error}</div>`;
                }
            }
        } catch (error) {
            if (outputDiv) {
                outputDiv.innerHTML = `<div class="error">Error parsing workout: ${error}</div>`;
            }
        }
    });

    // Handle exercise reference
    const categoryFilter = document.getElementById('categoryFilter') as HTMLSelectElement;
    const muscleGroupFilter = document.getElementById('muscleGroupFilter') as HTMLSelectElement;
    const exerciseList = document.getElementById('exerciseList');

    async function loadExercises() {
        try {
            const response = await fetch('/api/exercises');
            const data = await response.json();
            
            if (data.success && exerciseList) {
                exerciseList.innerHTML = data.exercises
                    .filter((exercise: any) => {
                        const categoryMatch = !categoryFilter.value || exercise.category === categoryFilter.value;
                        const muscleMatch = !muscleGroupFilter.value || exercise.muscleGroups.includes(muscleGroupFilter.value);
                        return categoryMatch && muscleMatch;
                    })
                    .map((exercise: any) => `
                        <div class="exercise-card" onclick="insertExercise('${exercise.name}')">
                            <h4>${exercise.name}</h4>
                            <div class="tags">
                                <span class="category">${exercise.category}</span>
                                ${exercise.muscleGroups.map((muscle: string) => `
                                    <span class="muscle">${muscle}</span>
                                `).join('')}
                            </div>
                        </div>
                    `).join('');
            }
        } catch (error) {
            console.error('Error loading exercises:', error);
        }
    }

    // Load exercises on filter change
    categoryFilter?.addEventListener('change', loadExercises);
    muscleGroupFilter?.addEventListener('change', loadExercises);

    // Initial load
    loadExercises();
}); 