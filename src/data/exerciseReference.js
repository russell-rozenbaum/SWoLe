"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exerciseReference = void 0;
exports.exerciseReference = [
    // Push Exercises - Chest
    {
        name: 'Flat Bench',
        category: 'Push',
        muscleGroups: ['Chest', 'Front Deltoids', 'Triceps'],
        equipment: ['BB'],
        weightType: 'weighted',
        description: 'Standard barbell bench press performed on a flat bench',
        template: 'BB Bench Press\n? x ? for ?'
    },
    {
        name: 'DB Seated Should Press',
        category: 'Push',
        muscleGroups: ['Front Deltoids', 'Side Deltoids', 'Triceps'],
        equipment: ['DB'],
        weightType: 'weighted',
        description: 'Overhead press performed seated with dumbbells',
        template: 'DB Shoulder Press\n?ea x ? for ?'
    },
    {
        name: 'DB Skullcrushers',
        category: 'Push',
        muscleGroups: ['Triceps'],
        equipment: ['DB'],
        weightType: 'weighted',
        description: 'Lying triceps extension performed with a dumbbell',
        template: 'DB Skullcrushers\n?ea x ? for ?'
    },
    {
        name: 'EZ Bar Skullcrushers',
        category: 'Push',
        muscleGroups: ['Triceps'],
        equipment: ['BB'],
        weightType: 'weighted',
        description: 'Lying triceps extension performed with an EZ curl bar',
        template: 'BB Skullcrushers\n? x ? for ?'
    },
    {
        name: 'DB Should Flies',
        category: 'Push',
        muscleGroups: ['Side Deltoids', 'Front Deltoids'],
        equipment: ['DB'],
        weightType: 'weighted',
        description: 'Lateral raise movement for shoulder development',
        template: 'DB Shoulder Flies\n?ea x ? for ?'
    },
    {
        name: 'Cable Tricep Pushdowns',
        category: 'Push',
        muscleGroups: ['Triceps'],
        equipment: ['Cable'],
        weightType: 'weighted',
        description: 'Standing triceps extension using a cable machine',
        template: 'Cable Tricep Pushdown\n? x ? for ?'
    },
    {
        name: 'Seated Chest Flies',
        category: 'Push',
        muscleGroups: ['Chest', 'Front Deltoids'],
        equipment: ['Machine'],
        weightType: 'weighted',
        description: 'Pec fly movement performed on a machine',
        template: 'Machine Chest Flies\n? x ? for ?'
    },
    {
        name: 'Push Ups',
        category: 'Push',
        muscleGroups: ['Chest', 'Front Deltoids', 'Triceps'],
        equipment: ['BW'],
        weightType: 'both',
        description: 'Standard bodyweight push-up, can be done with added weight via weight vest',
        template: 'BW Push Ups\nbw x ? for ?'
    },
    // Pull Exercises
    {
        name: 'DB Rows',
        category: 'Pull',
        muscleGroups: ['Upper Back', 'Lats', 'Biceps'],
        equipment: ['DB'],
        weightType: 'weighted',
        description: 'Single-arm dumbbell row',
        template: 'DB Row\n?ea x ? for ?'
    },
    {
        name: 'Pull Ups',
        category: 'Pull',
        muscleGroups: ['Lats', 'Upper Back', 'Biceps'],
        equipment: ['BW'],
        weightType: 'both',
        description: 'Bodyweight pull-up, can be done with added weight via belt',
        template: 'BW Pull Ups\nbw x ? for ?'
    },
    {
        name: 'Lat Pulldowns',
        category: 'Pull',
        muscleGroups: ['Lats', 'Upper Back', 'Biceps'],
        equipment: ['Cable'],
        weightType: 'weighted',
        description: 'Cable pulldown targeting the latissimus dorsi',
        template: 'Cable Lat Pulldown\n? x ? for ?'
    },
    {
        name: 'EZ Bar Curls',
        category: 'Pull',
        muscleGroups: ['Biceps', 'Forearms'],
        equipment: ['BB'],
        weightType: 'weighted',
        description: 'Bicep curl using an EZ curl bar',
        template: 'BB Curl\n? x ? for ?'
    },
    {
        name: 'DB Curls',
        category: 'Pull',
        muscleGroups: ['Biceps', 'Forearms'],
        equipment: ['DB'],
        weightType: 'weighted',
        description: 'Standard dumbbell bicep curl',
        template: 'DB Curl\n?ea x ? for ?'
    },
    {
        name: 'Cable Lat Pulldowns',
        category: 'Pull',
        muscleGroups: ['Lats', 'Upper Back', 'Biceps'],
        equipment: ['Cable'],
        weightType: 'weighted',
        description: 'Variation of lat pulldown focusing on mind-muscle connection',
        template: 'Cable Lat Pulldown\n? x ? for ?'
    },
    {
        name: 'DB Shrugs',
        category: 'Pull',
        muscleGroups: ['Traps'],
        equipment: ['DB'],
        weightType: 'weighted',
        description: 'Shoulder shrug movement with dumbbells',
        template: 'DB Shrugs\n?ea x ? for ?'
    },
    // Legs Exercises
    {
        name: 'BB RDLs',
        category: 'Legs',
        muscleGroups: ['Hamstrings', 'Lower Back', 'Glutes'],
        equipment: ['BB'],
        weightType: 'weighted',
        description: 'Romanian deadlift with barbell',
        template: 'BB RDL\n? x ? for ?'
    },
    {
        name: 'Seated Ham Curls',
        category: 'Legs',
        muscleGroups: ['Hamstrings'],
        equipment: ['Machine'],
        weightType: 'weighted',
        description: 'Seated hamstring curl machine',
        template: 'Machine Ham Curl\n? x ? for ?'
    },
    {
        name: 'Abductors',
        category: 'Legs',
        muscleGroups: ['Glutes', 'Hip Flexors'],
        equipment: ['Machine'],
        weightType: 'weighted',
        description: 'Hip abduction machine targeting outer thigh and glutes',
        template: 'Machine Abductor\n? x ? for ?'
    },
    {
        name: 'Leg Press Calf Raises',
        category: 'Legs',
        muscleGroups: ['Calves'],
        equipment: ['Machine'],
        weightType: 'weighted',
        description: 'Calf raise performed on the leg press machine',
        template: 'Machine Calf Raise\n? x ? for ?'
    },
    {
        name: 'Side Glute Raises',
        category: 'Legs',
        muscleGroups: ['Glutes', 'Hip Flexors'],
        equipment: ['BW'],
        weightType: 'bodyweight',
        description: 'Bodyweight side-lying hip abduction',
        template: 'BW Side Glute Raise\nbw x ? for ?'
    },
    {
        name: 'Hip Flexor Raises',
        category: 'Legs',
        muscleGroups: ['Hip Flexors'],
        equipment: ['BW'],
        weightType: 'bodyweight',
        description: 'Standing hip flexor raises',
        template: 'BW Hip Flexor Raise\nbw x ? for ?'
    },
    {
        name: 'BB Squat',
        category: 'Legs',
        muscleGroups: ['Quads', 'Glutes', 'Hamstrings'],
        equipment: ['BB'],
        weightType: 'weighted',
        description: 'Standard barbell back squat',
        template: 'BB Squat\n? x ? for ?'
    },
    {
        name: 'Bodyweight Squats',
        category: 'Legs',
        muscleGroups: ['Quads', 'Glutes', 'Hamstrings'],
        equipment: ['BW'],
        weightType: 'bodyweight',
        description: 'Standard bodyweight squat',
        template: 'BW Squat\nbw x ? for ?'
    },
    {
        name: 'Dips',
        category: 'Push',
        muscleGroups: ['Chest', 'Triceps', 'Front Deltoids'],
        equipment: ['BW'],
        weightType: 'both',
        description: 'Bodyweight dips, can be done with added weight via belt',
        template: 'BW Dips\nbw x ? for ?'
    }
];
