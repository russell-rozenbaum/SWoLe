import { WorkoutParser } from '../parser/WorkoutParser';

describe('WorkoutParser Tests', () => {
  const parser = new WorkoutParser();

  interface TestCase {
    name: string;
    input: string;
    shouldPass: boolean;
    expectedOutput?: string;
    expectedErrors?: string[];
  }

  const testCases: TestCase[] = [
    // Valid cases with output checking
    {
      name: "Basic single exercise",
      input: `01/24/2024
BB Bench Press
225 x 5 for 3`,
      shouldPass: true,
      expectedOutput: `1/24/2024
BB Bench Press
225 x 5
225 x 5
225 x 5
`
    },
    {
      name: "Multiple exercises with drop set",
      input: `01/01/2024
BB Bench Press
225 x 5 for 3

DB Curl
30ea x 12 -> 25ea x 10`,
      shouldPass: true,
      expectedOutput: `1/1/2024
BB Bench Press
225 x 5
225 x 5
225 x 5
DB Curl
30ea x 12 drop to 25ea x 10
`
    },
    {
      name: "Basic bodyweight exercise",
      input: `01/24/2024
BW Pull Ups
bw x 8 for 3`,
      shouldPass: true,
      expectedOutput: `1/24/2024
BW Pull Ups
bw x 8
bw x 8
bw x 8
`
    },
    {
      name: "Bodyweight exercise with added weight",
      input: `01/24/2024
BW Pull Ups
bw+25 x 5 for 2`,
      shouldPass: true,
      expectedOutput: `1/24/2024
BW Pull Ups
bw+25 x 5
bw+25 x 5
`
    },
    {
      name: "Bodyweight exercise with assisted weight",
      input: `01/24/2024
BW Pull Ups
bw-40 x 8 for 2`,
      shouldPass: true,
      expectedOutput: `1/24/2024
BW Pull Ups
bw-40 x 8
bw-40 x 8
`
    },
    {
      name: "Bodyweight exercise with drop set",
      input: `01/24/2024
BW Pull Ups
bw+25 x 5 -> bw x 5`,
      shouldPass: true,
      expectedOutput: `1/24/2024
BW Pull Ups
bw+25 x 5 drop to bw x 5
`
    },
    {
      name: "Complex bodyweight workout",
      input: `01/24/2024
BW Pull Ups
bw+45 x 5 -> bw x 8
bw x 10 F8,9,10

BW Push Ups
bw x 20 for 3`,
      shouldPass: true,
      expectedOutput: `1/24/2024
BW Pull Ups
bw+45 x 5 drop to bw x 8
bw x 10 F8,9,10
BW Push Ups
bw x 20
bw x 20
bw x 20
`
    },
    // Valid cases
    {
      name: "Multiple exercises",
      input: `01/24/2024
BB Bench Press
225 x 5 for 3

DB Curl
30ea x 12 for 3`,
      shouldPass: true
    },
    {
      name: "Split set",
      input: `01/24/2024
split {
  BB Bench Press
  225 x 5 for 3

  DB Row
  75ea x 8 for 3
}`,
      shouldPass: true
    },
    {
      name: "Workout with note",
      input: `01/24/2024
(IM)
BB Bench Press
225 x 5 for 3`,
      shouldPass: true
    },
    {
      name: "Exercise with failure points",
      input: `01/24/2024
Push Ups
Bw x 8 F7,8,9`,
      shouldPass: true
    },
    {
      name: "Exercise with drop set",
      input: `01/24/2024
DB Curl
40ea x 8 -> 30ea x 6`,
      shouldPass: true
    },
    {
      name: "Exercise with negatives",
      input: `01/24/2024
Pull Ups
Bw x 5 x 2 negatives`,
      shouldPass: true
    },

    // Error cases
    {
      name: "Future date",
      input: `12/31/2025
BB Bench Press
225 x 5 for 3`,
      shouldPass: false,
      expectedErrors: ["Workout date cannot be in the future"]
    },
    {
      name: "Missing date",
      input: `BB Bench Press
225 x 5 for 3`,
      shouldPass: false,
      expectedErrors: ["Expected [0-9]"]
    },
    {
      name: "Invalid date format",
      input: "2024-01-24\nBB Bench Press\n225 x 5 for 3",
      shouldPass: false,
      expectedErrors: ['Expected "/" or [0-9] but "-" found.']
    },
    {
      name: "Missing weight",
      input: `01/24/2024
BB Bench Press
x 5 for 3`,
      shouldPass: false,
      expectedErrors: ["Expected number"]
    },
    {
      name: "Missing reps",
      input: `01/24/2024
BB Bench Press
225 x`,
      shouldPass: false,
      expectedErrors: ["Expected integer"]
    },
    {
      name: "Invalid weight modifier for BB",
      input: `01/24/2024
BB Bench Press
225ea x 5 for 3`,
      shouldPass: false,
      expectedErrors: ["Barbell exercises should not have weight modifiers"]
    },
    {
      name: "Missing weight modifier for DB",
      input: `01/24/2024
DB Curl
30 x 12 for 3`,
      shouldPass: false,
      expectedErrors: ["Dumbbell exercises require a weight modifier"]
    },
    {
      name: "Invalid bodyweight exercise name",
      input: `01/24/2024
BW Bench Press
bw x 10 for 3`,
      shouldPass: false,
      expectedErrors: ["Invalid bodyweight exercise name"]
    },
    {
      name: "Using bodyweight for non-bodyweight exercise",
      input: `01/24/2024
BB Bench Press
bw x 10 for 3`,
      shouldPass: false,
      expectedErrors: ["Cannot use bodyweight for non-bodyweight exercise"]
    },
    {
      name: "Mixed weight types in drop set",
      input: `01/24/2024
BB Bench Press
225 x 5 -> bw x 10`,
      shouldPass: false,
      expectedErrors: ["Drop set must use the same weight type"]
    }
  ];

  testCases.forEach(testCase => {
    test(testCase.name, () => {
      const { workout, errors } = parser.parse(testCase.input);

      if (testCase.shouldPass) {
        expect(errors).toHaveLength(0);
        if (testCase.expectedOutput) {
          expect(parser.formatWorkout(workout)).toBe(testCase.expectedOutput);
        }
      } else {
        expect(errors.length).toBeGreaterThan(0);
        if (testCase.expectedErrors) {
          testCase.expectedErrors.forEach(expectedError => {
            expect(errors.some(error => error.message.includes(expectedError))).toBeTruthy();
          });
        }
      }
    });
  });
}); 