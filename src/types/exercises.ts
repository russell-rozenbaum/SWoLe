import { ExerciseType, MuscleGroup } from './index';

export type BenchVariant = 'Flat Bench' | 'Incline Bench' | 'Decline Bench' | 'Bench Press';
export type ShoulderPressVariant = 'Shoulder Press' | 'Military Press' | 'Overhead Press';
export type RowVariant = 'Row' | 'Bent Over Row' | 'Single Arm Row';
export type CurlVariant = 'Curl' | 'Bicep Curl' | 'Hammer Curl' | 'EZ Bar Curl';
export type SquatVariant = 'Squat' | 'Back Squat' | 'Front Squat' | 'Bodyweight Squat' | 'Air Squat';
export type PullUpVariant = 'Pull Ups' | 'Chin Ups' | 'Wide Grip Pull Ups' | 'Pullups' | 'Pull-Ups';
export type DipVariant = 'Dips' | 'Chest Dips' | 'Tricep Dips';
export type PushUpVariant = 'Push Ups' | 'Pushups' | 'Push-Ups';
export type TricepVariant = 
  | 'Tricep Pushdown' 
  | 'Tricep Push Down' 
  | 'Tricep-Pushdown' 
  | 'Pushdown' 
  | 'Rope Pushdown' 
  | 'Skullcrushers' 
  | 'Skull Crushers' 
  | 'Skull-Crushers' 
  | 'Tricep Extension';
export type ShoulderVariant = 'Shoulder Flies' | 'Lateral Raise' | 'Side Raise';
export type ChestVariant = 'Chest Flies' | 'Pec Flies' | 'Pec Deck';
export type RDLVariant = 'RDL' | 'Romanian Deadlift' | 'Stiff Leg Deadlift';
export type HamstringVariant = 'Ham Curl' | 'Hamstring Curl' | 'Leg Curl';
export type AbductorVariant = 'Abductor' | 'Hip Abductor';
export type CalfVariant = 'Calf Raise' | 'Standing Calf Raise' | 'Seated Calf Raise' | 'BB Calf Raises' | 'Single Leg Calf Raises' | 'Leg Press Calf Raises' | 'BB Elevated Calf Raises';
export type GluteVariant = 'Glute Kickback' | 'Side Glute Raise' | 'Sideways Glute Leg Lifts' | 'Single Leg Glute Bridges';
export type HipFlexorVariant = 'Hip Flexor Raise' | 'Standing Leg Raise';
export type ShrugsVariant = 'Shrugs' | 'Shoulder Shrugs';
export type LatVariant = 'Lat Pulldown' | 'Pulldown' | 'Wide Grip Pulldown';
export type BridgeVariant = 'Bridges' | 'Single Leg Bridges' | 'Glute Bridges';
export type QuadExtensionVariant = 'Quad Extension' | 'Grounded Quad Extension' | 'Single Leg Quad Raises';
export type TibialisVariant = 'Tibialis Raises';
export type HipVariant = 'Hip Abductor' | 'Hip Adductor';
export type RearDeltVariant = 'Rear Delt Flies' | 'Cable Rear Delt Flies' | 'DB Rear Delt Flies' | 'Seated Rear Delt Flies';
export type VBarVariant = 'VBar Rows';
export type ShouldFlyVariant = 'Should Flies' | 'DB Should Flies' | 'Cable Should Flies' | 'DB Quarter Should Flies';
export type DeadliftVariant = 
  | 'Deadlift' 
  | 'Conventional Deadlift'
  | 'Sumo Deadlift' 
  | 'Romanian Deadlift' 
  | 'RDL' 
  | 'BB RDLs';
export type MachineVariant = 'Seated Machine Should Press' | 'Seated Chest Flies' | 'Seated Single Grip Rows' | 'Seated Lat Pulldowns' | 'Glute Kickback Machine';
export type PreacherVariant = 'Preacher Curls';

export type ExerciseVariant =
  | BenchVariant
  | ShoulderPressVariant
  | RowVariant
  | CurlVariant
  | SquatVariant
  | PullUpVariant
  | DipVariant
  | PushUpVariant
  | TricepVariant
  | BridgeVariant
  | QuadExtensionVariant
  | CalfVariant
  | TibialisVariant
  | HipVariant
  | RearDeltVariant
  | VBarVariant
  | ShouldFlyVariant
  | DeadliftVariant
  | GluteVariant
  | MachineVariant
  | PreacherVariant;

// Map exercise variants to their allowed equipment types
export const EXERCISE_EQUIPMENT: Record<ExerciseVariant, ExerciseType[]> = {
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

export type Equipment = 'BB' | 'DB' | 'Cable' | 'Machine' | 'BW';

export type ExerciseReference = {
  name: string;
  variations: string[];
  category: 'Push' | 'Pull' | 'Legs';
  muscleGroups: MuscleGroup[];
  equipment: Equipment[];
  weightType: 'weight' | 'bodyweight';
  description: string;
  template: string;
}; 