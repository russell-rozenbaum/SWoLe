export const DOCUMENTATION_TEXT = `# SWoLe - Structured Workout Language

# Basic Structure
# A workout consists of a date followed by exercises and their sets
# Each exercise starts with an equipment prefix and name, followed by sets

# Equipment Prefixes
# BB  - Barbell exercises (e.g., BB Bench Press)
# DB  - Dumbbell exercises (e.g., DB Curl)
# BW  - Bodyweight exercises (e.g., BW Push Ups)
# Machine - Machine exercises (e.g., Machine Chest Press)
# Cable - Cable exercises (e.g., Cable Tricep Pushdown)

# Basic Exercise Format:
# [Equipment] [Exercise Name]
# [Weight] x [Reps] for [Sets]

# Example:
BB Bench Press  # Barbell bench press
225 x 5 for 3   # 3 sets of 5 reps at 225 lbs

# Dumbbell Exercises use 'ea' (each) for weight
DB Curl         # Dumbbell bicep curls
30ea x 12 for 3 # 3 sets of 12 reps with 30 lb dumbbells

# Bodyweight Exercises use 'bw' for weight
BW Push Ups     # Standard push-ups
bw x 20 for 3   # 3 sets of 20 reps with bodyweight

# Drop Sets
# Use -> to indicate weight drops within a set
BB Bench Press
225 x 5 -> 185 x 5 -> 135 x 5 for 3  # 3 sets with 3 weight drops each

# superset Sets
# Use superset { } to group exercises done in alternation
superset {
  BB Bench Press    # First exercise in superset
  225 x 5 for 3     # Sets for first exercise
  
  DB Row           # Second exercise in superset
  75ea x 8 for 3    # Sets for second exercise
}

# Failure Points
# Use F followed by rep numbers to indicate failure points
BB Bench Press
225 x 8 F5,7 for 3  # Failed at reps 5 and 7

# Negatives
# Add 'x N negative' to indicate negative reps at the end
BB Bench Press
225 x 5 x 3 negative for 3  # 5 regular reps + 3 negative reps

# Placeholders
# Use ? for unknown/variable weights or reps
BB Bench Press
? x ? for 3  # Weight and reps to be determined

# Full Example Workout:
01/24/2024

# Push Day
BB Bench Press     # Flat barbell bench press
225 x 5 for 3      # 3 sets of 5 reps at 225 lbs

superset {
  DB Shoulder Press  # Dumbbell overhead press
  50ea x 12 for 3    # 3 sets of 12 reps with 50 lb dumbbells
  
  BW Push Ups       # Regular push-ups
  bw x 20 for 3      # 3 sets of 20 reps
}

Cable Tricep Pushdown  # Cable pushdown for triceps
70 x 12 -> 50 x 12 for 3  # Drop sets: 70 lbs for 12, then 50 lbs for 12

# Notes:
# - Comments start with # and can be on their own line or after exercises
# - Weights are in pounds (lbs)
# - Rest periods between sets are not specified in the syntax
# - Exercise names are case-sensitive and must match the reference list
`; 