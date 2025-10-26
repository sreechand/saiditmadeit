## Snake Word Game

A revolutionary Snake-themed word puzzle game for Reddit's Devvit platform that combines classic snake mechanics with strategic word discovery gameplay. Players guide a snake through a 6×6 grid of letters to collect three hidden themed words while avoiding distractor words, creating an engaging blend of action and vocabulary skills.

### What Makes This Game Unique

🐍 **Stop-and-Wait Innovation**: Unlike traditional snake games, the snake automatically stops at each letter cell, allowing players to strategically plan their next move and think about word formation.

🎯 **Intelligent Puzzle Generation**: Advanced algorithm creates solvable puzzles with proper word distribution, ensuring every game is both challenging and fair.

🎨 **Visual Word Formation**: Snake segments change color based on correctness - green/blue for target word letters, red/gray for mistakes, providing instant visual feedback.

🧩 **Multi-Directional Word Placement**: Words can be placed horizontally or vertically in both directions (left-to-right, right-to-left, top-to-bottom, bottom-to-top), creating complex puzzle layouts.

📱 **Mobile-Optimized Controls**: Supports both keyboard (WASD/Arrow keys) and touch controls (swipe gestures) for seamless gameplay across devices.

### Technology Stack

- [Devvit](https://developers.reddit.com/): Reddit's developer platform for building immersive games
- [Vite](https://vite.dev/): For compiling the webView
- [React](https://react.dev/): For UI components and game interface
- [Express](https://expressjs.com/): For backend API and puzzle generation
- [Tailwind](https://tailwindcss.com/): For responsive styling
- [TypeScript](https://www.typescriptlang.org/): For type safety across client and server

## How to Play

### Game Objective
Find and collect all three hidden target words by guiding your snake through the letter grid. Target words share a common theme, while distractor words are designed to mislead you.

### Step-by-Step Instructions

#### 1. **Starting the Game**
- The game begins with your snake (blue head) at position (0,0) in the top-left corner
- You'll see a 6×6 grid filled with letters
- Three target words are hidden in the grid, along with 2+ distractor words

#### 2. **Moving Your Snake**
- **Desktop**: Use Arrow Keys or WASD to move up, down, left, right
- **Mobile**: Swipe in the direction you want to move
- **Auto-Stop**: Your snake automatically stops when it reaches any letter

#### 3. **Collecting Letters**
- When stopped at a letter, the game checks if it's the correct next letter for any target word
- **Correct Letter**: Snake grows with a green/blue segment, you earn 10 points
- **Wrong Letter**: Snake grows with a red/gray segment, you lose 5 points
- After collecting a letter, press any movement key to continue

#### 4. **Word Formation Rules**
- Letters must be collected in sequence (first letter → last letter)
- Words can be spelled in any direction the word is placed
- You can collect target words in any order
- Distractor words give fewer points and don't count toward victory

#### 5. **Winning the Game**
- Collect all three target words to win
- **Word Completion Bonus**: 50 points for target words, 25 for distractors
- **Victory Screen**: Shows the theme, your final score, and statistics

#### 6. **Game Controls**
- **Spacebar**: Pause/Resume the game
- **R Key**: Reset the game
- **Movement**: Arrow Keys, WASD, or swipe gestures

### Difficulty Levels

#### Easy Mode (2 cells/second)
- Target words are visible on screen
- Slower snake movement for careful planning
- Best for learning the game mechanics

#### Medium Mode (3 cells/second)
- Shows word blanks with letter counts (e.g., "_ _ _ _" for 4-letter word)
- Moderate snake speed
- Balanced challenge for regular players

#### Hard Mode (4 cells/second)
- No hints about target words
- Faster snake movement requires quick decisions
- Maximum challenge for experienced players

### Themed Categories

#### 🐾 Animals
Target words like CAT, DOG, EAGLE, SHARK, WHALE, TIGER
Distractors from other categories to confuse players

#### 🎨 Colors  
Target words like RED, BLUE, VIOLET, CORAL, INDIGO
Mixed with non-color words as distractors

#### 🍎 Food
Target words like APPLE, PIZZA, HONEY, BEANS, GRAPE
Combined with non-food distractors

#### ⚽ Sports
Target words like SOCCER, TENNIS, RUGBY, DIVE, SWIM
Includes various athletic activities and sports terms

#### 🌲 Nature
Target words like TREE, OCEAN, FOREST, BEACH, RIVER
Natural world elements and landscapes

### Scoring System
- **Correct Letters**: 10 points each
- **Target Word Completion**: 50 point bonus
- **Distractor Word Completion**: 25 point bonus  
- **Wrong Letter Penalty**: -5 points each
- **Time Bonus**: Faster completion = higher final score
- **Final Statistics**: Snake length, accuracy, completion time

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

The Snake Word Game features a sophisticated architecture built with modern web technologies and advanced game design principles:

### Puzzle Generation System
- **Multi-Attempt Algorithm**: Tries up to 100 generation attempts to create optimal puzzles
- **Multi-Directional Placement**: Words placed horizontally (left-to-right, right-to-left) and vertically (top-to-bottom, bottom-to-top)
- **Smart Collision Detection**: Prevents invalid overlaps while allowing strategic letter sharing
- **Pathfinding Validation**: Ensures all target words are reachable using A* pathfinding algorithms
- **Quality Scoring**: Rates puzzles based on word distribution, orientation variety, and accessibility
- **Fallback Generation**: Provides guaranteed-solvable simple puzzles if complex generation fails

### Game State Management Architecture
- **`useGameState`**: Central state management using React's useReducer pattern with comprehensive action types
- **`useSnake`**: Handles movement physics, collision detection, automatic stopping, and growth mechanics
- **`useWordCollection`**: Manages letter validation, sequential word formation, and scoring logic
- **`useGameController`**: Coordinates input handling (keyboard + touch), game flow, and event management
- **TypeScript Safety**: Strict typing across all components with shared interfaces and comprehensive error handling

### Theme Management System
- **Curated Word Database**: 100+ carefully selected words across 5 themed categories
- **Difficulty-Aware Filtering**: Dynamically selects words based on length and complexity for chosen difficulty
- **Conflict Avoidance Algorithm**: Prevents words with excessive shared letters to reduce player confusion
- **Comprehensive Validation**: Multi-layer validation system with detailed error reporting and warnings
- **Smart Grid Filling**: Uses uncommon consonants to avoid accidental word formations in empty cells

### Advanced Game Mechanics
- **Stop-and-Wait Innovation**: Snake automatically pauses at letter cells for strategic decision-making
- **Visual Feedback System**: Real-time color coding of snake segments (blue head, green correct, red wrong)
- **Sequential Word Formation**: Enforces correct letter order collection with progress tracking
- **Multi-Input Support**: Seamless keyboard (WASD/Arrows) and touch (swipe) controls
- **Responsive Timing**: Configurable snake speeds (2-4 cells/second) based on difficulty level

## Current Development Status

### ✅ Completed Features
- **Complete Game Logic**: All core game mechanics implemented via React hooks
- **Puzzle Generation**: Advanced algorithm with multi-directional word placement and validation
- **Snake Movement System**: Physics, collision detection, and stop-and-wait mechanics
- **Word Collection Logic**: Sequential letter validation and scoring system
- **Input Handling**: Keyboard and touch controls with direction validation
- **Theme Database**: 100+ words across 5 categories with smart selection algorithms
- **State Management**: Comprehensive React hooks architecture with TypeScript safety

### 🚧 In Progress
- **Game UI Components**: React components for game board, snake visualization, and word tracking
- **Victory/Game Over Screens**: End game displays with statistics and replay options
- **Visual Effects**: Animations for word completion, snake growth, and score updates

### 📋 Next Steps
1. **Build Game Board Component**: 6×6 grid with letter cells and snake visualization
2. **Create Word Tracker UI**: Progress indicators for target words and collected words display
3. **Implement Game Controls**: Pause/resume buttons, difficulty selection, theme picker
4. **Add Victory Screen**: Theme reveal, final statistics, and replay functionality
5. **Polish Visual Design**: Animations, particle effects, and mobile-responsive styling

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

## Development Tools

This Snake Word Game was built using [Kiro](https://kiro.dev), an AI-powered development environment that enabled rapid prototyping and implementation of complex game mechanics. The project showcases advanced React patterns, TypeScript architecture, and sophisticated puzzle generation algorithms.

### Key Implementation Highlights
- **Modular Hook Architecture**: Clean separation of concerns across game systems
- **Advanced Puzzle Generation**: Multi-attempt algorithm with quality scoring and validation
- **Comprehensive Type Safety**: Strict TypeScript interfaces across client, server, and shared code
- **Mobile-First Design**: Touch controls and responsive layout considerations
- **Performance Optimization**: Efficient state management and rendering patterns
