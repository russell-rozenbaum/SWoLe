"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WorkoutParser_1 = require("./parser/WorkoutParser");
const testWorkout = `01/01/2024
BB Bench Press
225 x 5 for 3

DB Curl
30ea x 12 for 3

superset {
  BB Squat
  315 x 5 for 3

  DB Row
  75ea x 8 for 3
}`;
const parser = new WorkoutParser_1.WorkoutParser();
try {
    const { workout, errors } = parser.parse(testWorkout);
    if (errors.length > 0) {
        console.log('Parsing errors:', errors);
    }
    if (workout) {
        console.log('Parsed workout:', JSON.stringify(workout, null, 2));
        console.log('\nFormatted workout:');
        console.log(parser.formatWorkout(workout));
    }
}
catch (error) {
    console.error('Error:', error);
}
