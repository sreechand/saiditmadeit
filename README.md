## Snake Word Game

A revolutionary Snake-themed word puzzle game for Reddit's Devvit platform that combines classic snake mechanics with strategic word discovery gameplay. Players guide a snake through a 6×6 grid of letters to collect three hidden themed words while avoiding distractor words, creating an engaging blend of action and vocabulary skills.

### What Makes This Game Unique

🐍 **Stop-and-Wait Innovation**: Unlike traditional snake games, the snake automatically stops at each letter cell, allowing players to strategically plan their next move and think about word formation. This creates a perfect balance between action and puzzle-solving.

🎯 **Intelligent Puzzle Generation**: Advanced algorithm creates solvable puzzles with proper word distribution across four orientations (horizontal left-to-right, right-to-left, vertical top-to-bottom, bottom-to-top), ensuring every game is both challenging and fair.

🎨 **Visual Word Formation**: Snake segments change color based on correctness - blue head with direction arrows, green segments for target word letters, red segments for mistakes, providing instant visual feedback on your progress.

🧩 **Multi-Directional Word Placement**: Words can be placed in any of four orientations, creating complex puzzle layouts that require spatial thinking and strategic snake navigation.

📱 **Cross-Platform Controls**: Seamlessly supports keyboard controls (WASD/Arrow keys), touch controls with directional buttons, and swipe gestures for mobile devices.

🎭 **Rich Theme System**: Five themed categories (Animals, Colors, Food, Sports, Nature) with 100+ carefully curated words, smart difficulty scaling, and conflict-avoidance algorithms to prevent player confusion.

🎮 **Adaptive Difficulty**: Three difficulty levels that change both gameplay mechanics and visual hints - from word-visible easy mode to hint-free hard mode with faster snake speeds.

🏆 **Comprehensive Scoring**: Dynamic scoring system with base points, word completion bonuses, time bonuses, and efficiency multipliers based on difficulty level.

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
- Click the "🐍 Start Playing" button on the splash screen
- The game begins with your snake (blue head with direction arrow) at position (0,0) in the top-left corner
- You'll see a 6×6 grid filled with letters in a responsive layout
- Three target words are hidden in the grid, along with 2+ distractor words
- The left sidebar shows your progress and theme information

#### 2. **Understanding the Interface**
- **Left Sidebar**: Word tracker showing target word progress, theme category, and game statistics
- **Center**: Interactive game board with 6×6 letter grid and animated snake overlay
- **Right Sidebar**: Game controls including movement buttons, pause/resume, settings, and keyboard shortcuts
- **Visual Feedback**: Snake head shows direction arrow, segments are color-coded by correctness

#### 3. **Moving Your Snake**
- **Desktop**: Use Arrow Keys or WASD to move up, down, left, right
- **Mobile**: Use touch controls (directional buttons) or swipe gestures in any direction
- **Auto-Stop**: Your snake automatically stops when it reaches any letter cell
- **Direction Indicator**: Snake head displays an arrow (↑↓←→) showing current movement direction

#### 4. **Collecting Letters**
- When stopped at a letter, the game automatically checks if it's the correct next letter for any target word
- **Correct Letter**: Snake grows with a green segment, you earn 10 points, word progress updates
- **Wrong Letter**: Snake grows with a red/gray segment, you lose 5 points, wrong letter counter increases
- **Letter Marking**: Collected letters are marked with yellow highlighting on the grid
- After processing the letter, press any movement key to continue

#### 5. **Word Formation Rules**
- Letters must be collected in sequence (first letter → last letter in word direction)
- Words can be spelled in any of four orientations: horizontal (left-to-right, right-to-left) or vertical (top-to-bottom, bottom-to-top)
- You can collect target words in any order
- **Target Words**: Give 50 point completion bonus and count toward victory
- **Distractor Words**: Give 25 point completion bonus but don't count toward victory

#### 6. **Winning the Game**
- Collect all three target words to win (distractor words are optional)
- **Victory Screen**: Shows the theme category, your final score, completion time, and detailed statistics
- **Final Score**: Based on correct letters (10 pts), word bonuses (50/25 pts), wrong letter penalties (-5 pts), and time bonus

#### 7. **Game Controls & Features**
- **Spacebar**: Pause/Resume the game (or use pause button)
- **R Key**: Reset the game (or use restart button)
- **Settings Button**: Change difficulty level and theme category
- **Movement**: Arrow Keys, WASD, touch controls, or swipe gestures
- **Real-time Stats**: Track snake length, correct/wrong segments, and word collection progress

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

The game features five carefully curated theme categories, each with 20+ target words and 20+ distractor words:

#### 🐾 Animals (Living Creatures)
**Target words**: CAT, DOG, BIRD, FISH, BEAR, WOLF, LION, TIGER, MOUSE, HORSE, SHEEP, GOAT, DUCK, FROG, SNAKE, EAGLE, SHARK, WHALE, DEER, FOX, RABBIT, TURTLE
**Distractors**: Non-animal words like TREE, ROCK, BOOK, CHAIR, HOUSE, MUSIC, FIRE, WIND, CLOUD, STAR

#### 🎨 Colors (Visual Spectrum)  
**Target words**: RED, BLUE, GREEN, YELLOW, BLACK, WHITE, PINK, BROWN, GRAY, ORANGE, PURPLE, GOLD, SILVER, VIOLET, INDIGO, CORAL, LIME, NAVY, BEIGE
**Distractors**: Non-color words like HOUSE, TREE, BOOK, MUSIC, DANCE, SPORT, FOOD, CHAIR, TABLE, PHONE

#### 🍎 Food (Edible Items)
**Target words**: APPLE, BREAD, CHEESE, FISH, MEAT, RICE, PASTA, PIZZA, CAKE, MILK, WATER, JUICE, SOUP, SALAD, BERRY, GRAPE, LEMON, PEACH, HONEY, BEANS, CORN
**Distractors**: Non-food items like CHAIR, TABLE, BOOK, PHONE, MUSIC, TREE, FLOWER, STONE, HOUSE, WIND

#### ⚽ Sports (Athletic Activities)
**Target words**: SOCCER, TENNIS, GOLF, SWIM, RUN, JUMP, BIKE, SKATE, SURF, CLIMB, DANCE, YOGA, BOXING, RUGBY, HOCKEY, TRACK, DIVE, RACE, THROW
**Distractors**: Non-sports words like BOOK, MUSIC, FOOD, HOUSE, TREE, FLOWER, WATER, FIRE, STONE, METAL

#### 🌲 Nature (Natural World)
**Target words**: TREE, FLOWER, GRASS, ROCK, WATER, FIRE, WIND, CLOUD, RAIN, SNOW, SUN, MOON, STAR, OCEAN, RIVER, LAKE, HILL, BEACH, FOREST, FIELD, STONE
**Distractors**: Man-made objects like HOUSE, CAR, PHONE, BOOK, MUSIC, CHAIR, TABLE, GLASS, METAL, PAPER

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
- **Full UI Implementation**: Complete React component system with responsive design
- **Game Board Component**: 6×6 interactive grid with letter cells and snake visualization overlay
- **Word Tracker UI**: Real-time progress indicators, theme display, and statistics dashboard
- **Game Controls**: Touch controls, keyboard input, pause/resume, settings modal with difficulty/theme selection
- **Snake Visualization**: Animated snake with color-coded segments, direction indicators, and smooth movement
- **Input Handling**: Comprehensive keyboard (WASD/Arrow keys) and touch controls with swipe gesture support
- **Theme Database**: 100+ words across 5 categories with smart selection algorithms and conflict avoidance
- **State Management**: Comprehensive React hooks architecture with TypeScript safety and action-based updates
- **Mobile Optimization**: Responsive design with touch controls, swipe gestures, and mobile-first layout

### 🚧 In Progress
- **Server Integration**: API endpoints for puzzle generation and score submission
- **Victory/Game Over Screens**: End game displays with statistics and replay options
- **Puzzle Generation API**: Server-side puzzle creation with theme and difficulty parameters

### 📋 Next Steps
1. **Complete Server API**: Build puzzle generation and score tracking endpoints
2. **Add Victory Screen**: Theme reveal, final statistics, and replay functionality
3. **Implement Leaderboard**: Score tracking and competitive features
4. **Polish Visual Effects**: Animations for word completion, snake growth, and score updates
5. **Final Testing**: End-to-end gameplay testing and performance optimization

## Testing and Development

### Local Development
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open the provided Reddit playtest URL (e.g., `https://www.reddit.com/r/your-app_dev?playtest=your-app`)
3. Click "Launch App" to test the game in full-screen mode

### Current UI Implementation

The game features a complete, responsive user interface built with React and Tailwind CSS:

#### **Splash Screen**
- Engaging welcome screen with Snoo mascot and game description
- Large "🐍 Start Playing" button to launch the game
- Links to Devvit documentation and r/Devvit community

#### **Main Game Interface**
- **Three-Column Layout**: Word tracker (left), game board (center), controls (right)
- **Responsive Design**: Adapts to mobile and desktop screen sizes
- **Real-time Updates**: All UI elements update dynamically based on game state

#### **Game Board**
- **6×6 Interactive Grid**: Letter cells with hover effects and visual feedback
- **Snake Overlay**: Animated snake segments positioned over the grid
- **Color Coding**: Blue head with direction arrows, green correct segments, red wrong segments
- **Letter States**: Visual distinction between normal, collected, and word-part letters

#### **Word Tracker Sidebar**
- **Theme Display**: Shows current theme category in highlighted box
- **Target Word Progress**: Individual progress bars for each target word with completion status
- **Game Statistics**: Real-time tracking of wrong letters, collected words, and completion percentage
- **Difficulty-Aware Display**: Shows words, blanks, or minimal hints based on difficulty level

#### **Game Controls Sidebar**
- **Touch Controls**: Mobile-optimized directional buttons with visual feedback
- **Control Buttons**: Pause/Resume, Restart, and Settings buttons
- **Settings Modal**: Difficulty selection (Easy/Medium/Hard) and theme picker
- **Keyboard Instructions**: Desktop users see keyboard shortcut reference
- **Snake Status**: Real-time display of snake length, correct/wrong segments, and movement state

### Game Controls
- **Arrow Keys** or **WASD**: Move snake up, down, left, right
- **Touch Controls**: Directional buttons or swipe gestures for mobile
- **Automatic Stop**: Snake stops at each letter cell for strategic planning
- **Sequential Collection**: Eat letters in order to spell target words
- **Visual Feedback**: Watch snake segments change color based on correct/incorrect letters
- **Spacebar**: Pause/Resume game
- **R Key**: Restart game

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
