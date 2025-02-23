import { ExerciseType } from './index';

export type BenchVariant = 'Flat Bench' | 'Incline Bench' | 'Decline Bench' | 'Bench Press';
export type ShoulderPressVariant = 'Shoulder Press' | 'Military Press' | 'Overhead Press';
export type RowVariant = 'Row' | 'Bent Over Row' | 'Single Arm Row';
export type CurlVariant = 'Curl' | 'Bicep Curl' | 'Hammer Curl' | 'EZ Bar Curl';
export type SquatVariant = 'Squat' | 'Back Squat' | 'Front Squat' | 'Bodyweight Squat';
export type PullUpVariant = 'Pull Ups' | 'Chin Ups' | 'Wide Grip Pull Ups';

export type ExerciseVariant = 
  | BenchVariant
  | ShoulderPressVariant
  | RowVariant
  | CurlVariant
  | SquatVariant
  | PullUpVariant;

// Map exercise variants to their allowed equipment types
export const EXERCISE_EQUIPMENT: Record<ExerciseVariant, ExerciseType[]> = {
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