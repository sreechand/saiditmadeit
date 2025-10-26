# Snake Movement Test Cases

## Overview
Comprehensive test suite for verifying snake movement using arrow keys, snake extension, and letter color changes in the Snake Word Game.

## Test Files Created

### 1. `src/client/__tests__/snakeMovement.test.ts`
**Core movement logic and game state tests**

#### Basic Arrow Key Movement
- ✅ **Right Arrow**: Snake moves from (0,0) to (1,0), direction updates to 'right'
- ✅ **Left Arrow**: Snake moves from (2,0) to (1,0), direction updates to 'left'  
- ✅ **Up Arrow**: Snake moves from (0,2) to (0,1), direction updates to 'up'
- ✅ **Down Arrow**: Snake moves from (0,0) to (0,1), direction updates to 'down'

#### Snake Extension and Letter Collection
- ✅ **Snake Growth**: Length increases from 1 to 2 when collecting letters
- ✅ **Correct Letters**: New segments have `segmentType: 'correct'`
- ✅ **Wrong Letters**: New segments have `segmentType: 'wrong'`
- ✅ **Color Mapping**: Correct = green, Wrong = red in visual components

#### Movement Validation
- ✅ **Backwards Prevention**: Multi-segment snake cannot move into its body
- ✅ **Boundary Collision**: Snake stops when hitting grid edges
- ✅ **Direction Changes**: Immediate direction updates on key press
- ✅ **Rapid Input**: Handles multiple quick direction changes correctly

#### Animation System
- ✅ **Movement Animation**: `requestAnimationFrame` called when snake moves
- ✅ **Animation Stop**: `cancelAnimationFrame` called when movement stops
- ✅ **Frame-Rate Independence**: Uses performance.now() for consistent timing

### 2. `src/client/__tests__/keyboardInput.test.ts`
**Keyboard event handling and visual feedback tests**

#### Arrow Key Detection
- ✅ **Event Handling**: Detects ArrowUp, ArrowDown, ArrowLeft, ArrowRight
- ✅ **Event Prevention**: Calls `preventDefault()` on arrow keys
- ✅ **Non-Arrow Ignore**: Ignores Space, Enter, letter keys
- ✅ **Callback Execution**: Triggers direction change callbacks correctly

#### Visual Component Testing
- ✅ **Segment Rendering**: Correct number of snake segments displayed
- ✅ **Color Styling**: Head, correct, and wrong segments have distinct colors
- ✅ **Theme Colors**: Animals=amber, Colors=pink, Food=red, Sports=blue, Nature=green
- ✅ **Direction Indicators**: Head shows ▶ ▼ ◀ ▲ based on direction

#### Letter State Changes
- ✅ **Collected Letters**: Show yellow background with opacity
- ✅ **Word Letters**: Display theme-specific secondary colors
- ✅ **Snake Override**: Snake segments override letter cell colors
- ✅ **Collection Animation**: Ripple effects on letter collection

#### Animation Feedback
- ✅ **Movement Classes**: `animate-snake-slither` applied to moving head
- ✅ **Growth Classes**: `animate-snake-grow` applied to new segments
- ✅ **Wrong Shake**: `animate-wrong-letter-shake` for incorrect letters
- ✅ **Theme Trails**: Theme-specific trail colors during movement

### 3. `src/client/__tests__/snakeMovementIntegration.test.tsx`
**End-to-end integration tests with full game simulation**

#### Complete Game Flow
- ✅ **Initialization**: Game starts with 6x6 grid and single snake segment
- ✅ **Movement Sequence**: Right → Down → Left → Up sequence works correctly
- ✅ **State Updates**: Game status, snake length, direction update properly
- ✅ **Movement Logging**: All movements recorded in test log

#### Letter Collection Integration
- ✅ **Auto Collection**: Moving to word letters triggers collection automatically
- ✅ **Snake Growth**: Snake extends when letters are collected
- ✅ **Grid Updates**: Letters marked as collected on the board
- ✅ **Type Assignment**: Random correct/wrong assignment (70% correct)

#### Visual Integration
- ✅ **Theme Styling**: Animals theme applies amber colors throughout
- ✅ **Segment Indicators**: Head shows direction, body shows ✓/✗
- ✅ **Real-time Updates**: Visual changes happen immediately
- ✅ **Animation Coordination**: All animations work together smoothly

#### Edge Case Handling
- ✅ **Invalid Movements**: Backwards movement prevention with multi-segment snake
- ✅ **Boundary Respect**: Snake stops at grid boundaries
- ✅ **Rapid Input**: Multiple quick key presses handled correctly
- ✅ **State Consistency**: Game state remains consistent throughout

## Test Configuration

### `src/client/vitest.config.ts`
- **Framework**: Vitest with React plugin
- **Environment**: jsdom for DOM simulation
- **Setup**: Custom test setup file
- **Coverage**: Text, JSON, HTML reports
- **Aliases**: Path resolution for imports

### `src/client/test-setup.ts`
- **DOM Matchers**: @testing-library/jest-dom
- **Mocks**: ResizeObserver, IntersectionObserver, matchMedia
- **Animation**: requestAnimationFrame, cancelAnimationFrame
- **Performance**: performance.now() mock
- **Console**: Suppressed warnings during tests

## Expected Visual Behavior

### Arrow Key Press Sequence
1. **Key Detection**: Arrow key event captured and preventDefault() called
2. **Direction Update**: Snake direction immediately changes
3. **Movement Execution**: Snake head moves to next grid position
4. **Visual Update**: Direction indicator (▶ ▼ ◀ ▲) updates on head

### Letter Collection Sequence
1. **Position Check**: Snake moves to cell with letter
2. **Collection Trigger**: Letter collection logic activates
3. **Snake Growth**: New segment added with appropriate color
4. **Board Update**: Letter cell marked as collected
5. **Animation Play**: Growth and collection animations trigger

### Color Change Behavior
- **Correct Letters**: 
  - Snake segment: Green background (`bg-green-500`)
  - Segment indicator: Green checkmark (✓)
  - Animation: `animate-snake-grow`

- **Wrong Letters**:
  - Snake segment: Red background (`bg-red-500`) 
  - Segment indicator: Red X (✗)
  - Animation: `animate-wrong-letter-shake`

- **Collected Board Letters**:
  - Background: Yellow (`bg-yellow-200`)
  - Opacity: Reduced to 60%
  - State: `isCollected: true`

### Theme-Specific Colors
- **Animals**: Amber head (`bg-amber-600`), amber trail (`bg-amber-300`)
- **Colors**: Pink head (`bg-pink-600`), pink trail (`bg-pink-300`)
- **Food**: Red head (`bg-red-600`), red trail (`bg-red-300`)
- **Sports**: Blue head (`bg-blue-600`), blue trail (`bg-blue-300`)
- **Nature**: Green head (`bg-green-600`), green trail (`bg-green-300`)

## Running the Tests

### Installation
```bash
npm install  # Install all dependencies including test libraries
```

### Test Commands
```bash
npm run test              # Run tests in watch mode
npm run test:run          # Run tests once
npm run test:coverage     # Run with coverage report
npm run test:ui           # Run with visual UI
```

### Test Execution Flow
1. **Setup**: Mock environment and DOM
2. **Initialization**: Create test game state and components
3. **Interaction**: Simulate arrow key presses
4. **Assertion**: Verify movement, extension, and color changes
5. **Cleanup**: Reset mocks and timers

## Key Test Scenarios

### Scenario 1: Basic Movement
```typescript
// Initial: Snake at (0,0)
fireEvent.keyDown(document, { key: 'ArrowRight' });
// Expected: Snake at (1,0), direction = 'right'

fireEvent.keyDown(document, { key: 'ArrowDown' });
// Expected: Snake at (1,1), direction = 'down'
```

### Scenario 2: Letter Collection
```typescript
// Snake moves to letter position
changeDirection('right');
// Expected: Snake grows, letter marked collected, segment colored
```

### Scenario 3: Visual Feedback
```typescript
// Check for correct segment styling
expect(container.querySelector('[class*="bg-green-500"]')).toBeTruthy();
// Check for direction indicator
expect(container.textContent).toContain('▶');
```

### Scenario 4: Edge Cases
```typescript
// Try backwards movement with multi-segment snake
// Expected: Movement blocked, direction unchanged
```

## Success Criteria

### ✅ Movement Tests Pass When:
- Arrow keys trigger correct direction changes
- Snake position updates accurately
- Movement animations play smoothly
- Boundary collisions are handled properly

### ✅ Extension Tests Pass When:
- Snake length increases on letter collection
- New segments have correct type (correct/wrong)
- Growth animations play for new segments
- Snake maintains proper segment order

### ✅ Color Tests Pass When:
- Correct letters create green snake segments
- Wrong letters create red snake segments
- Board letters change to collected state
- Theme colors apply consistently

### ✅ Integration Tests Pass When:
- Complete movement sequences work end-to-end
- Visual feedback updates in real-time
- Game state remains consistent
- All animations coordinate properly

## Debugging and Troubleshooting

### Common Issues
1. **Animation Timing**: Use `vi.advanceTimersByTime()` for timer control
2. **DOM Updates**: Use `waitFor()` for async state changes
3. **Event Handling**: Ensure `preventDefault()` is called
4. **Component Rendering**: Check for proper React component mounting

### Debug Tools
- **Test UI**: `npm run test:ui` for visual test runner
- **Coverage**: `npm run test:coverage` for code coverage
- **Console Logs**: Test components include movement logging
- **DOM Inspection**: Use container queries to inspect rendered elements

This comprehensive test suite ensures that the snake movement system works correctly with arrow keys, properly extends the snake when collecting letters, and provides appropriate visual feedback through color changes and animations.