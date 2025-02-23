"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exerciseReference = void 0;
exports.exerciseReference = [
    // Push Exercises - Chest
    {
        name: 'Bench Press',
        variations: ['Flat Bench', 'Bench Press', 'Incline Bench', 'Decline Bench'],
        category: 'Push',
        muscleGroups: ['Chest', 'Front Deltoids', 'Triceps'],
        equipment: ['BB'],
        weightType: 'weighted',
        description: 'Standard barbell bench press performed on a flat bench',
        template: 'BB Bench Press\n? x ? for ?'
    },
    {
        name: 'Shoulder Press',
        variations: ['Shoulder Press', 'Military Press', 'Overhead Press'],
        category: 'Push',
        muscleGroups: ['Front Deltoids', 'Side Deltoids', 'Triceps'],
        equipment: ['DB'],
        weightType: 'weighted',
        description: 'Overhead press performed seated with dumbbells',
        template: 'DB Shoulder Press\n?ea x ? for ?'
    },
    {
        name: 'Skullcrushers',
        variations: ['Skullcrushers', 'Tricep Extension'],
        category: 'Push',
        muscleGroups: ['Triceps'],
        equipment: ['DB'],
        weightType: 'weighted',
        description: 'Lying triceps extension performed with a dumbbell',
        template: 'DB Skullcrushers\n?ea x ? for ?'
    },
    {
        name: 'Skullcrushers',
        variations: ['Skullcrushers', 'Tricep Extension'],
        category: 'Push',
        muscleGroups: ['Triceps'],
        equipment: ['BB'],
        weightType: 'weighted',
        description: 'Lying triceps extension performed with an EZ curl bar',
        template: 'BB Skullcrushers\n? x ? for ?'
    },
    {
        name: 'Shoulder Flies',
        variations: ['Shoulder Flies', 'Lateral Raise', 'Side Raise'],
        category: 'Push',
        muscleGroups: ['Side Deltoids', 'Front Deltoids'],
        equipment: ['DB'],
        weightType: 'weighted',
        description: 'Lateral raise movement for shoulder development',
        template: 'DB Shoulder Flies\n?ea x ? for ?'
    },
    {
        name: 'Tricep Pushdown',
        variations: ['Tricep Pushdown', 'Pushdown', 'Rope Pushdown'],
        category: 'Push',
        muscleGroups: ['Triceps'],
        equipment: ['Cable'],
        weightType: 'weighted',
        description: 'Standing triceps extension using a cable machine',
        template: 'Cable Tricep Pushdown\n? x ? for ?'
    },
    {
        name: 'Chest Flies',
        variations: ['Chest Flies', 'Pec Flies', 'Pec Deck'],
        category: 'Push',
        muscleGroups: ['Chest', 'Front Deltoids'],
        equipment: ['Machine'],
        weightType: 'weighted',
        description: 'Pec fly movement performed on a machine',
        template: 'Machine Chest Flies\n? x ? for ?'
    },
    {
        name: 'Push Ups',
        variations: ['Push Ups', 'Pushups', 'Push-Ups'],
        category: 'Push',
        muscleGroups: ['Chest', 'Front Deltoids', 'Triceps'],
        equipment: ['BW'],
        weightType: 'both',
        description: 'Standard bodyweight push-up, can be done with added weight via weight vest',
        template: 'BW Push Ups\nbw x ? for ?'
    },
    // Pull Exercises
    {
        name: 'Row',
        variations: ['Row', 'Single Arm Row', 'Bent Over Row'],
        category: 'Pull',
        muscleGroups: ['Upper Back', 'Lats', 'Biceps'],
        equipment: ['DB'],
        weightType: 'weighted',
        description: 'Single-arm dumbbell row',
        template: 'DB Row\n?ea x ? for ?'
    },
    {
        name: 'Pull Ups',
        variations: ['Pull Ups', 'Pullups', 'Pull-Ups', 'Wide Grip Pull Ups'],
        category: 'Pull',
        muscleGroups: ['Lats', 'Upper Back', 'Biceps'],
        equipment: ['BW'],
        weightType: 'both',
        description: 'Bodyweight pull-up, can be done with added weight via belt',
        template: 'BW Pull Ups\nbw x ? for ?'
    },
    {
        name: 'Lat Pulldown',
        variations: ['Lat Pulldown', 'Pulldown', 'Wide Grip Pulldown'],
        category: 'Pull',
        muscleGroups: ['Lats', 'Upper Back', 'Biceps'],
        equipment: ['Cable'],
        weightType: 'weighted',
        description: 'Cable pulldown targeting the latissimus dorsi',
        template: 'Cable Lat Pulldown\n? x ? for ?'
    },
    {
        name: 'Curl',
        variations: ['Curl', 'Bicep Curl', 'EZ Bar Curl'],
        category: 'Pull',
        muscleGroups: ['Biceps', 'Forearms'],
        equipment: ['BB'],
        weightType: 'weighted',
        description: 'Bicep curl using an EZ curl bar',
        template: 'BB Curl\n? x ? for ?'
    },
    {
        name: 'Curl',
        variations: ['Curl', 'Bicep Curl', 'Hammer Curl'],
        category: 'Pull',
        muscleGroups: ['Biceps', 'Forearms'],
        equipment: ['DB'],
        weightType: 'weighted',
        description: 'Standard dumbbell bicep curl',
        template: 'DB Curl\n?ea x ? for ?'
    },
    {
        name: 'Shrugs',
        variations: ['Shrugs', 'Shoulder Shrugs'],
        category: 'Pull',
        muscleGroups: ['Traps'],
        equipment: ['DB'],
        weightType: 'weighted',
        description: 'Shoulder shrug movement with dumbbells',
        template: 'DB Shrugs\n?ea x ? for ?'
    },
    // Legs Exercises
    {
        name: 'RDL',
        variations: ['RDL', 'Romanian Deadlift', 'Stiff Leg Deadlift'],
        category: 'Legs',
        muscleGroups: ['Hamstrings', 'Lower Back', 'Glutes'],
        equipment: ['BB'],
        weightType: 'weighted',
        description: 'Romanian deadlift with barbell',
        template: 'BB RDL\n? x ? for ?'
    },
    {
        name: 'Ham Curl',
        variations: ['Ham Curl', 'Hamstring Curl', 'Leg Curl'],
        category: 'Legs',
        muscleGroups: ['Hamstrings'],
        equipment: ['Machine'],
        weightType: 'weighted',
        description: 'Seated hamstring curl machine',
        template: 'Machine Ham Curl\n? x ? for ?'
    },
    {
        name: 'Abductor',
        variations: ['Abductor', 'Hip Abductor'],
        category: 'Legs',
        muscleGroups: ['Glutes', 'Hip Flexors'],
        equipment: ['Machine'],
        weightType: 'weighted',
        description: 'Hip abduction machine targeting outer thigh and glutes',
        template: 'Machine Abductor\n? x ? for ?'
    },
    {
        name: 'Calf Raise',
        variations: ['Calf Raise', 'Standing Calf Raise', 'Seated Calf Raise'],
        category: 'Legs',
        muscleGroups: ['Calves'],
        equipment: ['Machine'],
        weightType: 'weighted',
        description: 'Calf raise performed on the leg press machine',
        template: 'Machine Calf Raise\n? x ? for ?'
    },
    {
        name: 'Side Glute Raise',
        variations: ['Side Glute Raise', 'Hip Abduction'],
        category: 'Legs',
        muscleGroups: ['Glutes', 'Hip Flexors'],
        equipment: ['BW'],
        weightType: 'bodyweight',
        description: 'Bodyweight side-lying hip abduction',
        template: 'BW Side Glute Raise\nbw x ? for ?'
    },
    {
        name: 'Hip Flexor Raise',
        variations: ['Hip Flexor Raise', 'Standing Leg Raise'],
        category: 'Legs',
        muscleGroups: ['Hip Flexors'],
        equipment: ['BW'],
        weightType: 'bodyweight',
        description: 'Standing hip flexor raises',
        template: 'BW Hip Flexor Raise\nbw x ? for ?'
    },
    {
        name: 'Squat',
        variations: ['Squat', 'Back Squat', 'Front Squat'],
        category: 'Legs',
        muscleGroups: ['Quads', 'Glutes', 'Hamstrings'],
        equipment: ['BB'],
        weightType: 'weighted',
        description: 'Standard barbell back squat',
        template: 'BB Squat\n? x ? for ?'
    },
    {
        name: 'Squat',
        variations: ['Squat', 'Bodyweight Squat', 'Air Squat'],
        category: 'Legs',
        muscleGroups: ['Quads', 'Glutes', 'Hamstrings'],
        equipment: ['BW'],
        weightType: 'bodyweight',
        description: 'Standard bodyweight squat',
        template: 'BW Squat\nbw x ? for ?'
    },
    {
        name: 'Dips',
        variations: ['Dips', 'Chest Dips', 'Tricep Dips'],
        category: 'Push',
        muscleGroups: ['Chest', 'Triceps', 'Front Deltoids'],
        equipment: ['BW'],
        weightType: 'both',
        description: 'Bodyweight dips, can be done with added weight via belt',
        template: 'BW Dips\nbw x ? for ?'
    }
];
