# Requirements Document

## Introduction

A Snake-themed word puzzle game for Reddit's Devvit platform where players guide a snake through a 6×6 grid of letters to spell out three hidden themed words. The game combines classic snake mechanics with word discovery gameplay, challenging players to find and collect target words while avoiding distractor words.

## Glossary

- **Snake_Game_System**: The complete game application running on Devvit
- **Game_Grid**: The 6×6 letter grid containing all gameplay elements
- **Snake_Entity**: The player-controlled snake that moves through the grid
- **Target_Words**: Three themed words that must be collected to win
- **Distractor_Words**: Valid words not matching the theme, designed to mislead players
- **Letter_Cell**: Individual grid position containing a single alphabet letter
- **Word_Collection**: The process of eating letters in correct sequence to form words
- **Theme_Category**: The subject that connects all three target words

## Requirements

### Requirement 1

**User Story:** As a player, I want to control a snake through a letter grid, so that I can discover and collect hidden words.

#### Acceptance Criteria

1. WHEN the game starts, THE Snake_Game_System SHALL place the Snake_Entity at position (0,0) with length 1
2. WHEN the player presses arrow keys or WASD, THE Snake_Game_System SHALL move the Snake_Entity in the corresponding direction
3. WHILE the Snake_Entity moves, THE Snake_Game_System SHALL prevent movement through boundaries or the snake's own body
4. WHEN the Snake_Entity reaches a Letter_Cell, THE Snake_Game_System SHALL stop movement and wait for player input
5. THE Snake_Game_System SHALL move the Snake_Entity at a speed of 2-4 cells per second

### Requirement 2

**User Story:** As a player, I want to discover three hidden themed words on the grid, so that I can complete the puzzle challenge.

#### Acceptance Criteria

1. WHEN generating a puzzle, THE Snake_Game_System SHALL place exactly three Target_Words related to a single Theme_Category
2. WHEN generating a puzzle, THE Snake_Game_System SHALL place at least two Distractor_Words from unrelated categories
3. THE Snake_Game_System SHALL place words in horizontal or vertical orientations (left-to-right, right-to-left, top-to-bottom, bottom-to-top)
4. WHEN placing words, THE Snake_Game_System SHALL ensure all words fit completely within the 6×6 Game_Grid
5. THE Snake_Game_System SHALL fill remaining cells with random letters avoiding accidental word formations

### Requirement 3

**User Story:** As a player, I want to collect words by eating letters in the correct sequence, so that I can progress toward winning the game.

#### Acceptance Criteria

1. WHEN the Snake_Entity eats a letter from a Target_Word in correct sequence, THE Snake_Game_System SHALL grow the snake by 1 segment with correct color
2. WHEN the Snake_Entity eats a letter not part of Target_Words, THE Snake_Game_System SHALL grow the snake by 1 segment with wrong color
3. WHEN a complete Target_Word is collected, THE Snake_Game_System SHALL highlight the word and update progress tracking
4. THE Snake_Game_System SHALL require sequential letter collection (first letter to last letter in word direction)
5. THE Snake_Game_System SHALL allow Target_Words to be collected in any order

### Requirement 4

**User Story:** As a player, I want visual feedback on my progress, so that I can understand my current game state and performance.

#### Acceptance Criteria

1. THE Snake_Game_System SHALL display three progress indicators showing word completion status
2. WHEN Target_Words are collected, THE Snake_Game_System SHALL display them with positive highlighting
3. WHEN Distractor_Words are collected, THE Snake_Game_System SHALL display them with warning coloring
4. THE Snake_Game_System SHALL show a counter of wrong letters consumed
5. THE Snake_Game_System SHALL visually distinguish correct snake segments (green/blue) from wrong segments (red/gray)

### Requirement 5

**User Story:** As a player, I want clear win conditions and game completion feedback, so that I know when I've successfully completed the puzzle.

#### Acceptance Criteria

1. WHEN all three Target_Words are collected, THE Snake_Game_System SHALL display victory screen
2. WHEN victory occurs, THE Snake_Game_System SHALL reveal the Theme_Category name
3. WHEN victory occurs, THE Snake_Game_System SHALL display all collected words with correct/incorrect indicators
4. WHEN victory occurs, THE Snake_Game_System SHALL show final statistics (snake length, wrong letters, time)
5. THE Snake_Game_System SHALL provide options to play again or select new theme

### Requirement 6

**User Story:** As a player, I want multiple difficulty levels and theme categories, so that I can enjoy varied gameplay experiences.

#### Acceptance Criteria

1. WHERE easy difficulty is selected, THE Snake_Game_System SHALL show Target_Words to the player
2. WHERE medium difficulty is selected, THE Snake_Game_System SHALL show word blanks with letter counts
3. WHERE hard difficulty is selected, THE Snake_Game_System SHALL provide no word hints
4. THE Snake_Game_System SHALL support multiple Theme_Categories (Animals, Colors, Food, Sports, Nature)
5. THE Snake_Game_System SHALL adjust snake speed based on selected difficulty level