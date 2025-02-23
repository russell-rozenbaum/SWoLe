# WorkoutLog

A domain-specific language (DSL) for tracking and analyzing workout data.

## Features

- Custom syntax for defining exercises and workouts
- Support for barbell and dumbbell exercises
- Split set tracking
- Progress analysis and visualization
- Web-based editor with syntax highlighting

## Installation

```bash
npm install
```

## Usage

### Basic Exercise Syntax

```
BB Bench Press
225 x 5 for 3

DB Curl
30ea x 12 for 3
```

### Split Sets

```
split {
  BB Bench Press
  225 x 5 for 3

  DB Row
  75ea x 8 for 3
}
```

## Development

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Run tests:
   ```bash
   npm test
   ```

## License

ISC
