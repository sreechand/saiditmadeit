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
Find and collect all three hidden target words by guiding your snake through the letter grid. Target words share a common theme, while distractor words are designed to mislead you. The challenge is to identify which words belong to the theme and collect them in the correct sequence.

### Complete Step-by-Step Instructions

#### 1. **Game Launch & Setup**
- Click the "🐍 Start Playing" button on the splash screen to enter full-screen mode
- The game initializes with your snake (blue head with direction arrow) at position (0,0) in the top-left corner
- A 6×6 grid appears filled with letters, containing 3 hidden target words and 2+ distractor words
- The interface displays three main sections: word tracker (left), game board (center), and controls (right)

#### 2. **Understanding the Game Interface**

**Left Sidebar - Word Tracker:**
- **Theme Display**: Shows the current theme category (Animals, Colors, Food, Sports, or Nature)
- **Target Word Progress**: Three progress bars showing completion status for each target word
- **Game Statistics**: Real-time tracking of wrong letters, snake length, and completion percentage
- **Difficulty Hints**: Shows words, word blanks, or minimal hints based on your difficulty setting

**Center - Game Board:**
- **6×6 Letter Grid**: Interactive grid with letters that light up when part of words
- **Snake Overlay**: Animated snake with color-coded segments positioned over the grid
- **Visual Feedback**: Letters change appearance when collected, words highlight when completed

**Right Sidebar - Game Controls:**
- **Movement Controls**: Touch buttons for mobile or keyboard shortcuts display for desktop
- **Game Actions**: Pause/Resume, Restart, and Settings buttons
- **Settings Modal**: Difficulty selection and theme picker accessible via settings button

#### 3. **Snake Movement & Controls**

**Desktop Controls:**
- **Arrow Keys** or **WASD**: Move snake up, down, left, right
- **Spacebar**: Pause/Resume game
- **R Key**: Restart current game
- **Auto-Stop Feature**: Snake automatically stops when reaching any letter cell

**Mobile Controls:**
- **Touch Buttons**: Tap directional arrows (↑↓←→) to move snake
- **Swipe Gestures**: Swipe in any direction for quick movement
- **Touch Interface**: All game controls optimized for touch interaction

**Movement Mechanics:**
- Snake moves at configurable speed (2-4 cells per second based on difficulty)
- Direction changes are immediate but snake won't move backwards into itself
- Snake head displays current direction with arrow indicators (↑↓←→)

#### 4. **Letter Collection System**

**Automatic Collection Process:**
1. Snake stops automatically when reaching any letter cell
2. Game checks if the letter is the correct next letter for any target word
3. **Correct Letter**: Snake grows with green segment, +10 points, word progress updates
4. **Wrong Letter**: Snake grows with red segment, -5 points, wrong letter counter increases
5. Letter is marked as collected (yellow highlight) and cannot be collected again
6. Press any movement key to continue snake movement

**Word Formation Rules:**
- Letters must be collected in exact sequence from first to last letter
- Words can be oriented in four directions: horizontal (→←) or vertical (↑↓)
- Target words can be collected in any order (you don't need to complete them sequentially)
- Each word has a unique path through the grid that must be followed precisely

#### 5. **Scoring & Progression System**

**Point Values:**
- **Correct Letters**: +10 points each
- **Wrong Letters**: -5 points each
- **Target Word Completion**: +50 point bonus
- **Distractor Word Completion**: +25 point bonus (but doesn't count toward victory)

**Victory Conditions:**
- Collect all three target words to win the game
- Distractor words are optional but provide bonus points
- Game ends immediately when all target words are completed

**Final Score Calculation:**
- **Base Score**: Points from letters and word completions
- **Time Bonus**: Faster completion = higher bonus (max 200 points)
- **Efficiency Bonus**: Fewer wrong letters = higher bonus (max 100 points)
- **Difficulty Multiplier**: Easy (1.0x), Medium (1.2x), Hard (1.5x)

#### 6. **Difficulty Levels & Game Modes**

**Easy Mode (2 cells/second):**
- Target words are fully visible in the word tracker
- Slower snake movement allows careful planning
- Theme hints provided to help identify target words
- Best for learning game mechanics and word recognition

**Medium Mode (3 cells/second):**
- Shows word blanks with letter counts (e.g., "_ _ _ _" for 4-letter word)
- Moderate snake speed requires balanced strategy
- No direct word hints but length information available
- Balanced challenge for regular players

**Hard Mode (4 cells/second):**
- No hints about target words - only theme category shown
- Faster snake movement requires quick decision-making
- Must discover words through theme knowledge and trial
- Maximum challenge for experienced players

#### 7. **Theme Categories & Word Database**

**🐾 Animals (Living Creatures):**
- Target words: CAT, DOG, BIRD, FISH, BEAR, WOLF, LION, TIGER, MOUSE, HORSE, SHEEP, GOAT, DUCK, FROG, SNAKE, EAGLE, SHARK, WHALE, DEER, FOX, RABBIT, TURTLE
- Distractors: Non-animal words like TREE, ROCK, BOOK, CHAIR, HOUSE, MUSIC, FIRE, WIND, CLOUD, STAR

**🎨 Colors (Visual Spectrum):**
- Target words: RED, BLUE, GREEN, YELLOW, BLACK, WHITE, PINK, BROWN, GRAY, ORANGE, PURPLE, GOLD, SILVER, VIOLET, INDIGO, CORAL, LIME, NAVY, BEIGE
- Distractors: Non-color words like HOUSE, TREE, BOOK, MUSIC, DANCE, SPORT, FOOD, CHAIR, TABLE, PHONE

**🍎 Food (Edible Items):**
- Target words: APPLE, BREAD, CHEESE, FISH, MEAT, RICE, PASTA, PIZZA, CAKE, MILK, WATER, JUICE, SOUP, SALAD, BERRY, GRAPE, LEMON, PEACH, HONEY, BEANS, CORN
- Distractors: Non-food items like CHAIR, TABLE, BOOK, PHONE, MUSIC, TREE, FLOWER, STONE, HOUSE, WIND

**⚽ Sports (Athletic Activities):**
- Target words: SOCCER, TENNIS, GOLF, SWIM, RUN, JUMP, BIKE, SKATE, SURF, CLIMB, DANCE, YOGA, BOXING, RUGBY, HOCKEY, TRACK, DIVE, RACE, THROW
- Distractors: Non-sports words like BOOK, MUSIC, FOOD, HOUSE, TREE, FLOWER, WATER, FIRE, STONE, METAL

**🌲 Nature (Natural World):**
- Target words: TREE, FLOWER, GRASS, ROCK, WATER, FIRE, WIND, CLOUD, RAIN, SNOW, SUN, MOON, STAR, OCEAN, RIVER, LAKE, HILL, BEACH, FOREST, FIELD, STONE
- Distractors: Man-made objects like HOUSE, CAR, PHONE, BOOK, MUSIC, CHAIR, TABLE, GLASS, METAL, PAPER

#### 8. **Victory Screen & Game Completion**

**Victory Display Features:**
- **Theme Reveal**: Shows the complete theme category name
- **Score Breakdown**: Detailed breakdown of base score, time bonus, and efficiency bonus
- **Game Statistics**: Final snake length, completion time, wrong letters, and difficulty level
- **Word Summary**: Lists all collected target words and any distractor words found
- **Performance Metrics**: Completion percentage, accuracy rating, and speed ranking

**Post-Game Options:**
- **Play Again**: Start new game with same theme and difficulty
- **New Theme**: Select different theme category for variety
- **Difficulty Change**: Adjust difficulty level through settings
- **Statistics Review**: View detailed performance breakdown before starting new game

#### 9. **Advanced Strategies & Tips**

**Efficient Snake Navigation:**
- Plan your route to minimize backtracking and wrong letters
- Use the stop-and-wait feature to study the grid before committing to moves
- Look for word patterns and common letter combinations within the theme
- Consider multiple possible words when you see promising letter sequences

**Theme Recognition Strategies:**
- Study the theme category to predict likely target words
- Eliminate obvious distractor words that don't fit the theme
- Look for word length patterns that match common words in the category
- Use process of elimination when multiple words seem possible

**Scoring Optimization:**
- Prioritize accuracy over speed to maximize efficiency bonus
- Complete shorter words first to build momentum and confidence
- Avoid collecting distractor words unless you're certain they're targets
- Use pause feature strategically to plan complex navigation routes

### Game Features Summary

**🎮 Core Gameplay:**
- 6×6 letter grid with hidden themed words
- Snake automatically stops at letters for strategic planning
- Sequential letter collection with visual feedback
- Multi-directional word placement (horizontal and vertical, both directions)

**🎯 Difficulty System:**
- Easy: Words visible, slow snake (2 cells/sec)
- Medium: Word blanks shown, medium snake (3 cells/sec)  
- Hard: No hints, fast snake (4 cells/sec)

**🏆 Scoring & Progression:**
- Base points: +10 correct letters, -5 wrong letters
- Word bonuses: +50 target words, +25 distractor words
- Time and efficiency bonuses based on performance
- Difficulty multipliers: Easy (1.0x), Medium (1.2x), Hard (1.5x)

**🎨 Visual Design:**
- Color-coded snake segments (blue head, green correct, red wrong)
- Real-time progress tracking and statistics
- Responsive design for mobile and desktop
- Smooth animations and visual feedback

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

## Technical Architecture

The Snake Word Game showcases sophisticated game architecture built with modern web technologies:

### Advanced Puzzle Generation Engine
- **Multi-Attempt Algorithm**: Tries up to 100 generation attempts with quality scoring to create optimal puzzles
- **Four-Directional Placement**: Words placed horizontally (left-to-right, right-to-left) and vertically (top-to-bottom, bottom-to-top)
- **Smart Collision Detection**: Prevents invalid overlaps while allowing strategic letter sharing when beneficial
- **Pathfinding Validation**: Ensures all target words are reachable by snake movement using pathfinding algorithms
- **Quality Scoring System**: Rates puzzles based on word distribution, orientation variety, accessibility, and solvability
- **Fallback Generation**: Provides guaranteed-solvable simple puzzles if complex generation fails

### React Hook Architecture
- **`useGameState`**: Central state management using useReducer with comprehensive action types and immutable updates
- **`useSnake`**: Frame-rate independent movement system with collision detection, automatic stopping, and growth mechanics
- **`useWordCollection`**: Sequential letter validation, word formation logic, and dynamic scoring calculations
- **`useGameController`**: Unified input handling for keyboard, touch, and swipe controls with event coordination
- **`useDifficulty`**: Dynamic difficulty management with real-time UI adaptation and puzzle regeneration
- **`useVictorySystem`**: End-game logic with score calculation, statistics tracking, and replay functionality

### Intelligent Word Database System
- **Curated Content**: 100+ carefully selected words across 5 themed categories with semantic validation
- **Difficulty-Aware Selection**: Dynamic word filtering based on length, complexity, and letter patterns
- **Conflict Avoidance**: Advanced algorithms prevent words with excessive shared letters to reduce confusion
- **Validation Pipeline**: Multi-layer validation with detailed error reporting and quality assurance
- **Smart Grid Filling**: Uses uncommon consonants and letter frequency analysis to avoid accidental word formations

### Game Mechanics Innovation
- **Stop-and-Wait System**: Revolutionary mechanic where snake pauses at letters for strategic planning
- **Visual Feedback Engine**: Real-time color coding system with smooth animations and state transitions
- **Sequential Collection Logic**: Enforces correct letter order with progress tracking and validation
- **Multi-Modal Input**: Seamless integration of keyboard, touch, and gesture controls with input buffering
- **Adaptive Timing**: Frame-rate independent movement with configurable speeds and smooth interpolation

## Development Status

### ✅ Production-Ready Features

**Complete Game Implementation:**
- **Advanced Puzzle Generation**: Multi-directional word placement with quality scoring and validation
- **Sophisticated Snake System**: Frame-rate independent movement with stop-and-wait mechanics
- **Comprehensive Word Collection**: Sequential validation, progress tracking, and dynamic scoring
- **Full React UI**: Complete component system with responsive design and smooth animations
- **Advanced State Management**: React hooks architecture with TypeScript safety and immutable updates

**Rich User Experience:**
- **Interactive Game Board**: 6×6 grid with animated snake overlay and visual feedback systems
- **Dynamic Word Tracker**: Real-time progress bars, theme display, and comprehensive statistics
- **Multi-Modal Controls**: Keyboard shortcuts, touch controls, and swipe gestures with input buffering
- **Adaptive Difficulty System**: Three levels with different hints, speeds, and scoring multipliers
- **Victory System**: Complete end-game experience with detailed statistics and replay options

**Professional Polish:**
- **Theme Database**: 100+ curated words with conflict-avoidance and difficulty-aware selection
- **Mobile Optimization**: Touch-first design with responsive layout and gesture support
- **Visual Design System**: Color-coded feedback, smooth animations, and accessibility compliance
- **Performance Optimization**: Efficient rendering, memory management, and frame-rate independence

### 🚧 Server Integration (In Progress)

**API Development:**
- Puzzle generation endpoints with theme and difficulty parameters
- Score submission and leaderboard functionality
- Reddit user integration and persistent data storage

**Deployment Preparation:**
- Production build optimization and testing
- Reddit platform integration and compliance
- Performance monitoring and error handling

### 🎯 Ready for Reddit Launch

The game is feature-complete and ready for Reddit deployment with:
- ✅ Full gameplay mechanics and user interface
- ✅ Comprehensive difficulty and theme systems  
- ✅ Mobile and desktop optimization
- ✅ Professional visual design and animations
- 🚧 Server API integration (final step)

## Testing and Development

### Local Development
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open the provided Reddit playtest URL (e.g., `https://www.reddit.com/r/your-app_dev?playtest=your-app`)
3. Click "Launch App" to test the game in full-screen mode

### Current Implementation Status

The Snake Word Game features a complete, production-ready implementation built with React and TypeScript:

#### **✅ Fully Implemented Features**

**Complete Game Logic:**
- Advanced puzzle generation with multi-directional word placement
- Snake movement system with stop-and-wait mechanics
- Sequential word collection and validation
- Comprehensive scoring system with bonuses and multipliers
- Victory conditions and game state management

**Full User Interface:**
- **Splash Screen**: Engaging welcome with Snoo mascot and game description
- **Three-Column Layout**: Word tracker (left), game board (center), controls (right)
- **Interactive Game Board**: 6×6 grid with animated snake overlay and visual feedback
- **Word Tracker**: Real-time progress bars, theme display, and statistics
- **Game Controls**: Touch controls, keyboard shortcuts, settings modal, pause/resume

**Advanced Systems:**
- **Difficulty Management**: Three levels with different hints, speeds, and scoring multipliers
- **Theme Database**: 100+ words across 5 categories with conflict-avoidance algorithms
- **Victory System**: Comprehensive end-game screen with statistics and replay options
- **Mobile Optimization**: Touch controls, swipe gestures, and responsive design

#### **🚧 In Development**

**Server Integration:**
- API endpoints for puzzle generation and score submission
- Leaderboard system with Reddit user integration
- Persistent score tracking and statistics

**Final Polish:**
- Enhanced visual effects and animations
- Audio system with sound effects and background music
- Performance optimization for extended gameplay sessions

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
