"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WorkoutParser_1 = require("./parser/WorkoutParser");
const testWorkout = `BB Bench Press
225 x 5 for 3

DB Curl
30ea x 12 for 3

split {
  BB Squat
  315 x 5 for 3

  DB Row
  75ea x 8 for 3
}`;
const parser = new WorkoutParser_1.WorkoutParser();
try {
    const workout = parser.parse(testWorkout);
    console.log('Parsed workout:', JSON.stringify(workout, null, 2));
    console.log('\nFormatted workout:');
    console.log(parser.formatWorkout(workout));
    // Validate exercises
    for (const block of workout.blocks) {
        if (block.type === 'single') {
            console.log(`\nValidating ${block.exercise.name}:`, parser.validateExercise(block.exercise));
        }
        else {
            for (const exercise of block.exercises) {
                console.log(`\nValidating ${exercise.name}:`, parser.validateExercise(exercise));
            }
        }
    }
}
catch (error) {
    console.error('Error:', error);
}
