# SWoLe (Simple Workout Language)

A powerful domain-specific language (DSL) and web application for tracking and analyzing workout data. SWoLe provides an intuitive, code-like syntax for logging exercises and workouts, making it easy to track your fitness progress over time.

## Features

- 🎯 Custom syntax designed specifically for workout tracking
- 💪 Support for various exercise types:
  - Barbell exercises (BB)
  - Dumbbell exercises (DB)
  - Bodyweight exercises
  - Machine exercises
- 🔄 Superset tracking and management
- 📊 Progress analysis and visualization
- 📝 Web-based editor with:
  - Real-time syntax highlighting
  - Error detection and validation
  - Auto-completion suggestions
- 📱 Responsive design for mobile and desktop use

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/russell-rozenbaum/SWoLe.git

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Basic Usage

The SWoLe language is designed to be intuitive and easy to read/write. Here are some examples:

#### Simple Exercise

```
BB Bench Press
135 x 10 for 1  # Warm-up set
225 x 5 for 3   # Working sets
```

#### Superset

```
superset {
  BB Bench Press
  225 x 5 for 3

  DB Row
  75ea x 8 for 3
}
```

#### Full Workout Example

```
# Push Day - 2024-02-23

BB Bench Press
135 x 10 for 1  # Warm-up
225 x 5 for 3   # Working sets

superset {
  DB Incline Press
  65ea x 8 for 3

  DB Lateral Raise
  20ea x 12 for 3
}

Machine Tricep Extension
60 x 12 for 3
```

## Development

### Running Locally

1. Start the development server:

   ```bash
   npm run dev
   ```

   This will start the application on `http://localhost:3000`

2. Run tests:
   ```bash
   npm test
   ```

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Acknowledgments

Special thanks to all contributors and users who have helped shape SWoLe into what it is today.
