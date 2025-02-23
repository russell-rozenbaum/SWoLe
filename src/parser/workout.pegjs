{
  function makeExercise(prefix, name, sets) {
    return {
      prefix: prefix || undefined,
      name,
      sets
    };
  }
  
  function makeSet(weight, reps, count) {
    const set = {
      weight,
      reps: parseInt(reps, 10)
    };
    return Array(parseInt(count, 10)).fill(set);
  }
}

// Main workout structure
Workout
  = blocks:WorkoutBlock* { return { blocks }; }

WorkoutBlock
  = SingleExercise
  / SplitSet

// Single exercise block
SingleExercise
  = exercise:ExerciseDefinition sets:SetDefinition+ {
    return {
      type: 'single',
      exercise: makeExercise(exercise.prefix, exercise.name, sets.flat())
    };
  }

// Split set block
SplitSet
  = "split" _ "{" NL
    exercises:SplitExercise+
    "}" NL? {
    return {
      type: 'split',
      exercises: exercises
    };
  }

SplitExercise
  = _ exercise:ExerciseDefinition sets:SetDefinition+ {
    return makeExercise(exercise.prefix, exercise.name, sets.flat());
  }

// Exercise definition
ExerciseDefinition
  = prefix:ExercisePrefix? name:ExerciseName NL {
    return { prefix, name: name.trim() };
  }

ExercisePrefix
  = ("BB" / "DB") _ { return text(); }

ExerciseName
  = (!NL .)+ { return text(); }

// Set definition
SetDefinition
  = _ weight:WeightSpec _ "x" _ reps:Integer _ "for" _ count:Integer NL {
    return makeSet(weight, reps, count);
  }

WeightSpec
  = value:Number modifier:WeightModifier? {
    return {
      value: parseFloat(value),
      modifier: modifier || undefined
    };
  }

WeightModifier
  = _ ("ea" / "sole") { return text().trim(); }

// Basic elements
Integer "integer"
  = [0-9]+ { return text(); }

Number "number"
  = Integer ("." Integer)? { return text(); }

_ "whitespace"
  = [ \t]*

NL "newline"
  = [\r\n]+ 