import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/mode/javascript/javascript.js';

// Initialize CodeMirror
document.addEventListener('DOMContentLoaded', () => {
    const editor = CodeMirror.fromTextArea(document.getElementById('workoutInput') as HTMLTextAreaElement, {
        mode: 'javascript',
        theme: 'monokai',
        lineNumbers: true,
        autofocus: true,
        lineWrapping: true,
    });

    // Add custom syntax highlighting
    editor.on('change', (cm) => {
        const doc = cm.getDoc();
        const content = doc.getValue();
        // Your existing syntax highlighting logic here
    });

    // Handle parse button click
    const parseButton = document.getElementById('parseButton');
    parseButton?.addEventListener('click', () => {
        const content = editor.getValue();
        try {
            // Your existing parsing logic here
            const outputArea = document.getElementById('outputArea');
            if (outputArea) {
                outputArea.textContent = JSON.stringify(content, null, 2);
            }
        } catch (error) {
            console.error('Parsing error:', error);
        }
    });
}); 