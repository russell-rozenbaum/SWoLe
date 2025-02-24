"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXERCISE_EQUIPMENT = void 0;
// Map exercise variants to their allowed equipment types
exports.EXERCISE_EQUIPMENT = {
    // Bench variants
    'Bench Press': ['BB'],
    'Flat Bench': ['BB'],
    'Incline Bench': ['BB'],
    'Decline Bench': ['BB'],
    // Shoulder press variants
    'Shoulder Press': ['BB', 'DB'],
    'Military Press': ['BB', 'DB'],
    'Overhead Press': ['BB', 'DB'],
    // Row variants
    'Row': ['BB', 'DB'],
    'Bent Over Row': ['BB', 'DB'],
    'Single Arm Row': ['DB'],
    // Curl variants
    'Curl': ['BB', 'DB'],
    'Bicep Curl': ['BB', 'DB'],
    'Hammer Curl': ['DB'],
    'EZ Bar Curl': ['BB'],
    // Squat variants
    'Squat': ['BB', 'BW'],
    'Back Squat': ['BB'],
    'Front Squat': ['BB'],
    'Bodyweight Squat': ['BW'],
    'Air Squat': ['BW'],
    // Pull up variants
    'Pull Ups': ['BW'],
    'Pull-Ups': ['BW'],
    'Pullups': ['BW'],
    'Chin Ups': ['BW'],
    'Wide Grip Pull Ups': ['BW'],
    // Dip variants
    'Dips': ['BW'],
    'Chest Dips': ['BW'],
    'Tricep Dips': ['BW'],
    // Push up variants
    'Push Ups': ['BW'],
    'Push-Ups': ['BW'],
    'Pushups': ['BW'],
    // Tricep variants
    'Tricep Pushdown': ['Cable'],
    'Tricep Push Down': ['Cable'],
    'Tricep-Pushdown': ['Cable'],
    'Pushdown': ['Cable'],
    'Rope Pushdown': ['Cable'],
    'Skullcrushers': ['BB', 'DB'],
    'Skull Crushers': ['BB', 'DB'],
    'Skull-Crushers': ['BB', 'DB'],
    'Tricep Extension': ['BB', 'DB'],
    // Bridge variants
    'Bridges': ['BB', 'BW'],
    'Single Leg Bridges': ['BW'],
    'Glute Bridges': ['BW'],
    // Quad extension variants
    'Quad Extension': ['BW'],
    'Grounded Quad Extension': ['BW'],
    'Single Leg Quad Raises': ['BW'],
    // Calf variants
    'Calf Raise': ['Machine'],
    'Standing Calf Raise': ['Machine'],
    'Seated Calf Raise': ['Machine'],
    'BB Calf Raises': ['BB'],
    'Single Leg Calf Raises': ['BW'],
    'Leg Press Calf Raises': ['Machine'],
    'BB Elevated Calf Raises': ['BB'],
    // Tibialis variants
    'Tibialis Raises': ['BW'],
    // Hip variants
    'Hip Abductor': ['Machine'],
    'Hip Adductor': ['Machine'],
    // Rear delt variants
    'Rear Delt Flies': ['DB', 'Cable'],
    'Cable Rear Delt Flies': ['Cable'],
    'DB Rear Delt Flies': ['DB'],
    'Seated Rear Delt Flies': ['Machine'],
    // VBar variants
    'VBar Rows': ['Cable'],
    // Shoulder fly variants
    'Should Flies': ['DB', 'Cable'],
    'DB Should Flies': ['DB'],
    'Cable Should Flies': ['Cable'],
    'DB Quarter Should Flies': ['DB'],
    // Deadlift variants
    'Deadlift': ['BB'],
    'Conventional Deadlift': ['BB'],
    'Sumo Deadlift': ['BB'],
    'Romanian Deadlift': ['BB'],
    'RDL': ['BB'],
    'BB RDLs': ['BB'],
    // Glute variants
    'Glute Kickback': ['Machine'],
    'Side Glute Raise': ['BW'],
    'Sideways Glute Leg Lifts': ['BW'],
    'Single Leg Glute Bridges': ['BW'],
    // Machine variants
    'Seated Machine Should Press': ['Machine'],
    'Seated Chest Flies': ['Machine'],
    'Seated Single Grip Rows': ['Machine'],
    'Seated Lat Pulldowns': ['Machine'],
    'Glute Kickback Machine': ['Machine'],
    // Preacher variants
    'Preacher Curls': ['BB']
};
