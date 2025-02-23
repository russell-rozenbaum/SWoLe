"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXERCISE_EQUIPMENT = void 0;
// Map exercise variants to their allowed equipment types
exports.EXERCISE_EQUIPMENT = {
    // Bench variants
    'Bench Press': ['BB', 'DB'],
    'Flat Bench': ['BB', 'DB'],
    'Incline Bench': ['BB', 'DB'],
    'Decline Bench': ['BB', 'DB'],
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
    // Pull up variants
    'Pull Ups': ['BW'],
    'Chin Ups': ['BW'],
    'Wide Grip Pull Ups': ['BW']
};
