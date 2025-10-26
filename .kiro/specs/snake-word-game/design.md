# Snake Word Game Design Document

## Overview

The Snake Word Game is a React-based puzzle game that combines classic snake mechanics with word discovery gameplay. Built for Reddit's Devvit platform, it features a 6×6 letter grid where players guide a snake to collect three themed words while avoiding distractor words. The game emphasizes strategic movement, pattern recognition, and vocabulary skills.

## Architecture

### Client-Server Architecture

**Client Side (`/src/client/`)**
- React application handling UI, game rendering, and user interactions
- Game state management using React hooks
- Canvas-based or CSS Grid rendering for the game board
- Real-time game loop for snake movement and animations

**Server Side (`/src/server/`)**
- Express API endpoints for game data and persistence
- Puzzle generation algorithms
- Score tracking and leaderboard management
- Redis integration for data persistence

**Shared (`/src/shared/`)**
- TypeScript interfaces for game state, puzzles, and API responses
- Common utilities for word validation and grid operations
- Theme definitions and word databases

### Game State Management

```typescript
interface GameState {
  grid: LetterCell[][];
  snake: SnakeSegment[];
  targetWords: Word[];
  distractorWords: Word[];
  collectedWords: CollectedWord[];
  currentTheme: Theme;
  gameStatus: 'playing' | 'paused' | 'won' | 'lost';
  score: number;
  wrongLetterCount: number;
  startTime: number;
}
```

## Components and Interfaces

### Core Game Components

**GameBoard Component**
- Renders 6×6 grid of letter cells
- Handles snake visualization with color-coded segments
- Displays word collection progress and feedback
- Manages game controls and input handling

**Snake Component**
- Manages snake entity state and movement logic
- Handles collision detection with boundaries and self
- Implements stop-and-wait mechanic at letter cells
- Provides visual distinction between correct/wrong segments

**WordTracker Component**
- Displays three progress indicators for target words
- Shows collected words with appropriate highlighting
- Tracks and displays wrong letter count
- Provides real-time feedback on word formation progress

**PuzzleGenerator Service**
- Generates themed word puzzles with configurable difficulty
- Places words in various orientations (horizontal/vertical, both directions)
- Ensures puzzle solvability and proper word distribution
- Fills remaining cells with random letters avoiding accidental words

### API Interfaces

```typescript
// Puzzle generation endpoint
POST /api/generate-puzzle
{
  theme: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Score submission endpoint
POST /api/submit-score
{
  theme: string;
  score: number;
  timeElapsed: number;
  wrongLetters: number;
}

// Leaderboard retrieval
GET /api/leaderboard/:theme
```

## Data Models

### Grid and Snake Models

```typescript
interface LetterCell {
  letter: string;
  position: { x: number; y: number };
  isPartOfWord: boolean;
  wordId?: string;
  isCollected: boolean;
}

interface SnakeSegment {
  position: { x: number; y: number };
  isHead: boolean;
  segmentType: 'correct' | 'wrong' | 'head';
}

interface Word {
  id: string;
  text: string;
  positions: { x: number; y: number }[];
  orientation: 'horizontal-lr' | 'horizontal-rl' | 'vertical-tb' | 'vertical-bt';
  isTarget: boolean;
  isCollected: boolean;
  collectionProgress: number;
}
```

### Theme and Difficulty Models

```typescript
interface Theme {
  name: string;
  targetWords: string[];
  distractorWords: string[];
  category: string;
}

interface DifficultySettings {
  showWords: boolean;
  showWordBlanks: boolean;
  snakeSpeed: number;
  allowSharedLetters: boolean;
}
```

## Game Logic Implementation

### Movement System

**Direction Control**
- Arrow keys or WASD input handling
- Prevent backward movement into snake body
- Boundary collision detection
- Smooth movement with configurable speed (2-4 cells/second)

**Stop-and-Wait Mechanic**
- Automatic stop when snake reaches any letter cell
- Wait for player input before continuing movement
- Visual indication of stopped state
- Input buffer to prevent accidental double moves

### Word Collection Logic

**Sequential Collection Validation**
```typescript
function validateLetterCollection(
  snake: SnakeSegment[],
  targetLetter: LetterCell,
  word: Word
): boolean {
  const expectedIndex = word.collectionProgress;
  const expectedPosition = word.positions[expectedIndex];
  return (
    targetLetter.position.x === expectedPosition.x &&
    targetLetter.position.y === expectedPosition.y
  );
}
```

**Growth and Visual Feedback**
- Correct letters: Add green/blue segment to snake
- Wrong letters: Add red/gray segment to snake
- Word completion: Highlight entire word with animation
- Progress tracking: Update UI indicators in real-time

**Cell Highlighting System**
```typescript
interface LetterCellVisualState {
  backgroundColor: 'white' | 'lightgreen' | 'lightred';
  textColor: 'black';
  isHighlighted: boolean;
  wordType?: 'target' | 'distractor';
}
```
- Default state: White background, black text for all cells
- Target word completion: Light green background for all cells in the word
- Distractor word completion: Light red background for all cells in the word
- Highlighting persists until game reset or new puzzle generation

### Puzzle Generation Algorithm

**Word Placement Strategy**
1. Select theme and generate word list (3 target + 2+ distractor)
2. Attempt placement in random orientations and positions
3. Validate no inappropriate overlaps or conflicts
4. Ensure all target words remain reachable by snake
5. Fill remaining cells with random letters
6. Validate no accidental word formations in remaining cells

## Error Handling

### Game State Errors

**Invalid Move Handling**
- Boundary collision: Stop movement, maintain current position
- Self-collision: Optional game over or continue based on difficulty
- Invalid input: Ignore and maintain current state

**Puzzle Generation Failures**
- Word placement conflicts: Retry with different positions/orientations
- Unsolvable puzzles: Regenerate with adjusted parameters
- Theme loading errors: Fall back to default theme

**Network and Persistence Errors**
- API failures: Continue with local state, retry in background
- Score submission failures: Queue for retry, show user notification
- Leaderboard loading: Show cached data or empty state with retry option

## Testing Strategy

### Unit Testing Focus

**Core Game Logic**
- Snake movement and collision detection
- Word collection validation and progress tracking
- Puzzle generation algorithm correctness
- Score calculation and validation

**Component Testing**
- GameBoard rendering with various game states
- Snake visualization with different segment types
- WordTracker progress display accuracy
- Input handling and game control responsiveness

### Integration Testing

**Client-Server Communication**
- Puzzle generation API endpoint functionality
- Score submission and retrieval accuracy
- Error handling for network failures
- Data persistence through Redis

**Game Flow Testing**
- Complete game sessions from start to victory
- Difficulty level variations and their effects
- Theme switching and puzzle regeneration
- Performance with extended gameplay sessions

### Performance Considerations

**Rendering Optimization**
- Efficient grid updates using React.memo and useMemo
- Canvas rendering for smooth snake animations
- Debounced input handling to prevent rapid-fire moves
- Lazy loading of theme data and word databases

**Memory Management**
- Cleanup of game timers and intervals on component unmount
- Efficient snake segment array management during growth
- Proper disposal of audio resources and animations
- Optimized puzzle generation to avoid memory leaks

## User Experience Design

### Visual Design System

**Color Scheme**
- Snake head: Distinct bright color (e.g., dark blue)
- Correct segments: Success color (green/blue)
- Wrong segments: Warning color (red/orange)
- Default letter cells: White background with black text
- Collected target words: Light green background highlighting
- Collected distractor words: Light red background highlighting
- Grid background: Neutral, high contrast for readability

**Typography and Layout**
- Large, readable letters in grid cells (minimum 24px)
- Clear visual hierarchy for UI elements
- Responsive design for mobile Reddit users
- Accessible color contrasts meeting WCAG guidelines

### Audio Design (Optional)

**Sound Effects**
- Letter collection: Subtle positive sound
- Word completion: Celebratory chime
- Wrong letter: Gentle warning tone
- Victory: Triumphant fanfare
- Background: Subtle, theme-appropriate ambient music

### Mobile Optimization

**Touch Controls**
- Swipe gestures for snake direction
- Large touch targets for game controls
- Responsive grid sizing for various screen sizes
- Portrait and landscape orientation support