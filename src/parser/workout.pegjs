{
  function makeExercise(prefix, name, sets) {
    return {
      prefix: prefix || undefined,
      name,
      sets
    };
  }
  
  function makeSet(weight, reps, count, failureNotes, dropSet, negatives) {
    const set = {
      weight,
      reps: parseInt(reps, 10),
      failureNotes: failureNotes || undefined,
      dropSet: dropSet || undefined,
      negatives: negatives || undefined
    };
    return Array(parseInt(count || "1", 10)).fill(set);
  }

  function parseDate(dateStr) {
    const [month, day, year] = dateStr.split('/').map(n => parseInt(n, 10));
    return new Date(year, month - 1, day);
  }

  function parseBodyWeightModifier(text) {
    if (!text) return undefined;
    const operation = text[0] === '+' ? '+' : '-';
    const value = parseInt(text.slice(1), 10);
    return { operation, value };
  }
}

// Main workout structure
Workout
  = date:DateLine NL? note:NoteLine? blocks:(WorkoutBlock NL*)* {
    return {
      date: date,
      note: note,
      blocks: blocks.map(b => b[0])
    };
  }

DateLine
  = month:[0-9]+ "/" day:[0-9]+ "/" year:[0-9]+ {
    return parseDate([month, day, year].map(d => d.join('')).join('/'));
  }

NoteLine
  = "(" [^)]+ ")" NL { return text(); }

WorkoutBlock
  = SingleExercise
  / SplitSet

// Single exercise block
SingleExercise
  = exercise:ExerciseDefinition sets:(SetDefinition NL*)+ {
    return {
      type: 'single',
      exercise: makeExercise(exercise.prefix, exercise.name, sets.map(s => s[0]).flat())
    };
  }

// Split set block
SplitSet
  = "split" _ "{" NL*
    exercises:(SplitExercise NL*)+
    "}" {
    return {
      type: 'split',
      exercises: exercises.map(e => e[0])
    };
  }

SplitExercise
  = _ exercise:ExerciseDefinition sets:(SetDefinition NL*)+ {
    return makeExercise(exercise.prefix, exercise.name, sets.map(s => s[0]).flat());
  }

// Exercise definition
ExerciseDefinition
  = prefix:ExercisePrefix? name:ExerciseName NL {
    const fullName = name.trim();
    return { prefix: prefix || undefined, name: fullName };
  }

ExercisePrefix
  = ("BB" / "DB" / "BW" / "Cable" / "Machine") _ { return text().trim(); }

ExerciseName
  = (!NL .)+ { return text(); }

// Set definition
SetDefinition
  = _ weight:WeightSpec _ "x" _ reps:Integer modifiers:SetModifiers? {
    const set = {
      weight,
      reps: reps === "?" ? "?" : parseInt(reps, 10),
      failureNotes: modifiers?.failureNotes || undefined,
      dropSet: modifiers?.dropSet || undefined,
      negatives: modifiers?.negatives || undefined
    };
    const count = modifiers?.count === "?" ? "1" : (modifiers?.count || "1");
    return Array(parseInt(count, 10)).fill(set);
  }

SetModifiers
  = failureNotes:FailureNotes? dropSet:DropSet? negatives:Negatives? forCount:ForCount? {
    return {
      failureNotes,
      dropSet,
      negatives,
      count: forCount
    };
  }

ForCount
  = _ "for" _ count:Integer { return count; }

WeightSpec
  = value:(BodyWeight / Number / Placeholder) modifier:WeightModifier? {
    if (value === "bw") {
      return {
        value: 0,
        isBodyWeight: true,
        modifier: "bw"
      };
    } else if (typeof value === "object" && 'isPlaceholder' in value) {
      return {
        value: 0,
        isPlaceholder: true,
        modifier: modifier
      };
    } else if (typeof value === "object" && 'modifier' in value) {
      return {
        value: 0,
        isBodyWeight: true,
        bodyWeightModifier: value.modifier,
        modifier: "bw"
      };
    }
    return {
      value: parseFloat(value),
      modifier: modifier
    };
  }

BodyWeight
  = bw:("bw" / "Bw" / "BW") mod:BodyWeightModifier? {
    return mod ? { modifier: mod } : "bw";
  }

BodyWeightModifier
  = operation:[+-] value:[0-9]+ {
    return {
      operation: operation,
      value: parseInt(value.join(''), 10)
    };
  }

WeightModifier
  = _ ("ea" / "sole") { return text().trim(); }

FailureNotes
  = _ "F" first:[0-9]+ rest:("," [0-9]+)* {
    return [first.join(''), ...rest.map(([_, nums]) => nums.join(''))];
  }

DropSet
  = drops:(_ "->" _ weight:WeightSpec _ "x" _ reps:Integer)+ {
    return drops.map(([_, __, ___, weight, ____, _____, ______, reps]) => ({
      ...weight,
      reps: reps === "?" ? "?" : parseInt(reps, 10)
    }));
  }

Negatives
  = _ "x" _ count:Integer _ "negative" "s"? {
    return parseInt(count, 10);
  }

// Basic elements
Integer "integer"
  = digits:[0-9]+ { return digits.join(''); }
  / "?" { return "?"; }

Number "number"
  = digits:([0-9]+ ("." [0-9]+)?) { 
    return digits.flat().join('');
  }
  / Placeholder

Placeholder "placeholder"
  = "?" { return { isPlaceholder: true }; }

_ "whitespace"
  = [ \t]*

NL "newline"
  = [\r\n]+ 