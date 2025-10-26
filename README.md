## Snake Word Game

A Snake-themed word puzzle game for Reddit's Devvit platform where players guide a snake through a 6×6 grid of letters to spell out three hidden themed words. The game combines classic snake mechanics with word discovery gameplay, challenging players to find and collect target words while avoiding distractor words.

### Technology Stack

- [Devvit](https://developers.reddit.com/): Reddit's developer platform for building immersive games
- [Vite](https://vite.dev/): For compiling the webView
- [React](https://react.dev/): For UI components and game interface
- [Express](https://expressjs.com/): For backend API and puzzle generation
- [Tailwind](https://tailwindcss.com/): For responsive styling
- [TypeScript](https://www.typescriptlang.org/): For type safety across client and server

## Game Features

### Core Gameplay
- **Snake Movement**: Control a snake through a 6×6 letter grid using arrow keys or WASD
- **Word Collection**: Eat letters in sequence to spell out hidden themed words
- **Stop-and-Wait Mechanic**: Snake automatically stops at each letter for strategic planning
- **Visual Feedback**: Color-coded snake segments (green/blue for correct, red/gray for wrong letters)

### Puzzle System
- **Themed Word Puzzles**: Five categories with extensive word databases
  - **Animals**: 22 target words (CAT, DOG, EAGLE, SHARK, etc.) + 21 distractors
  - **Colors**: 19 target words (RED, BLUE, VIOLET, CORAL, etc.) + 20 distractors  
  - **Food**: 21 target words (APPLE, PIZZA, HONEY, BEANS, etc.) + 20 distractors
  - **Sports**: 19 target words (SOCCER, TENNIS, RUGBY, DIVE, etc.) + 21 distractors
  - **Nature**: 21 target words (TREE, OCEAN, FOREST, BEACH, etc.) + 20 distractors
- **Multiple Orientations**: Words placed horizontally and vertically in both directions
- **Smart Generation**: Advanced algorithm ensures solvable puzzles with proper word distribution

### Difficulty Levels
- **Easy**: Target words visible, slower snake speed (2 cells/sec)
- **Medium**: Word blanks with letter counts, moderate speed (3 cells/sec)
- **Hard**: No hints, faster snake speed (4 cells/sec)

### Scoring System
- **Correct Letters**: 10 points per letter + 50 point word completion bonus
- **Wrong Letter Penalty**: -5 points per incorrect letter
- **Time Bonus**: Faster completion yields higher scores
- **Final Statistics**: Track snake length, wrong letters, and completion time

## Getting Started

### Prerequisites
- Node.js 22 or higher
- Reddit account connected to Reddit Developers

### Installation
1. Clone this repository or use the Devvit template:
   ```bash
   npm create devvit@latest --template=react
   ```
2. Go through the installation wizard and connect your Reddit account
3. Navigate to the project directory and install dependencies:
   ```bash
   npm install
   ```

## Development Commands

- `npm run dev`: Starts development server with live Reddit integration testing
- `npm run build`: Builds both client and server projects for production
- `npm run deploy`: Uploads a new version of your app to Reddit
- `npm run launch`: Publishes your app for Reddit review and approval
- `npm run login`: Authenticates your CLI with Reddit developers
- `npm run check`: Runs TypeScript checking, ESLint, and Prettier formatting

## Project Structure

```
src/
├── client/          # React frontend application
│   ├── components/  # Reusable UI components
│   ├── hooks/       # Custom React hooks
│   └── main.tsx     # Client entry point
├── server/          # Express backend API
│   ├── core/        # Business logic and routes
│   └── index.ts     # Server entry point
└── shared/          # Shared types and utilities
    ├── data/        # Theme database and word lists
    ├── types/       # TypeScript interfaces
    └── utils/       # Game logic and puzzle generation
```

## API Endpoints

### Puzzle Generation
```typescript
POST /api/generate-puzzle
{
  theme: string;           // 'Animals' | 'Colors' | 'Food' | 'Sports' | 'Nature'
  difficulty: string;      // 'easy' | 'medium' | 'hard'
}
```

### Score Submission
```typescript
POST /api/submit-score
{
  theme: string;
  score: number;
  timeElapsed: number;     // in seconds
  wrongLetters: number;
  difficulty: string;
}
```

### Leaderboard
```typescript
GET /api/leaderboard/:theme
// Returns top scores for the specified theme
```

## Game Architecture

### Puzzle Generation System
- **Advanced Algorithm**: Intelligently places 3 target words + 2+ distractor words
- **Collision Detection**: Prevents invalid word overlaps and ensures grid boundaries
- **Solvability Validation**: Ensures all target words are reachable by snake movement
- **Fallback Generation**: Provides simple backup puzzles if complex generation fails
- **Performance Optimization**: Multiple generation attempts to find optimal word placement

### Theme Management
- **Extensive Word Database**: 100+ words across 5 themed categories
- **Difficulty-Aware Selection**: Filters words by length and complexity based on difficulty
- **Conflict Avoidance**: Prevents words with too many shared letters to reduce confusion
- **Validation System**: Comprehensive theme and word validation with error reporting

### Game State Management
- **React Hooks**: Custom hooks for game state, snake movement, and word collection
- **TypeScript Safety**: Strict typing across all game components and API interfaces
- **Real-time Updates**: Immediate visual feedback for all player actions
- **Persistence**: Redis integration for score tracking and leaderboards

## Testing and Development

### Local Development
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open the provided Reddit playtest URL (e.g., `https://www.reddit.com/r/your-app_dev?playtest=your-app`)
3. Click "Launch App" to test the game in full-screen mode

### Game Controls
- **Arrow Keys** or **WASD**: Move snake up, down, left, right
- **Automatic Stop**: Snake stops at each letter cell for strategic planning
- **Sequential Collection**: Eat letters in order to spell target words
- **Visual Feedback**: Watch snake segments change color based on correct/incorrect letters

### Puzzle Testing
The game includes comprehensive puzzle validation:
- **Word Placement**: Ensures all words fit within grid boundaries
- **Solvability**: Validates that target words are reachable by snake movement
- **Quality Scoring**: Rates puzzle quality based on word distribution and accessibility
- **Fallback System**: Provides simple puzzles if complex generation fails

## Deployment

### Publishing Process
1. Build the application:
   ```bash
   npm run build
   ```
2. Deploy to Reddit:
   ```bash
   npm run deploy
   ```
3. Publish for review (required for subreddits with >200 members):
   ```bash
   npm run launch
   ```

### Platform Requirements
- **Node.js**: Version 22.2.0 or higher
- **Reddit Integration**: Automatic user authentication through Reddit
- **Mobile Optimization**: Responsive design for mobile Reddit users
- **Performance**: Optimized for smooth gameplay at 60fps

## Cursor Integration

This project came with a pre-configured Cursor environment. But I used [Kiro](https::/kiro.dev) to build.
