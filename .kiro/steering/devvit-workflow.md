# Devvit Development Workflow

## Primary Directive
You are implementing a Devvit project. Follow established documentation and maintain consistency with Devvit patterns.

## Task Execution Protocol

### Before Starting Any Task
- Check task dependencies and prerequisites
- Verify scope understanding
- Follow established directory structure requirements

### Architecture Decision Framework
Determine task scope:

**Client-side**: React UI shell + Phaser 3 interactive elements
- `/src/client/views/` - React screens
- `/src/client/components/` - Reusable components  
- `/src/client/game/scenes/` - Phaser scenes
- `/src/client/api/` - API wrappers

**Server-side**: Serverless Express API on Devvit runtime
- `/src/server/core/routes/` - Express route handlers
- `/src/server/core/services/` - Business logic services
- `/src/server/core/redis/` - Redis access helpers

**Shared**: Types and utilities between client/server
- `/src/shared/types/` - TypeScript interfaces
- `/src/shared/utils/` - Common utilities

## Devvit-Specific Implementation Patterns

### Server Development
```typescript
// ALWAYS use Devvit's createServer pattern
import { createServer, context, redis } from '@devvit/web/server'

// NEVER use direct Express server creation
// Route organization in src/server/core/routes/
// Redis access via import { redis } from '@devvit/web/server'
```

### Client Development
- **React shell**: For UI screens and navigation
- **Phaser 3**: For interactive elements (sliders, visualizations)
- **API calls**: Use fetch() to server endpoints
- **No websockets**: Use polling or Devvit's realtime service

### Build and Deploy Requirements
- **Vite config**: Must output to `/dist/client` and `/dist/server`
- **Devvit config**: `devvit.json` must point to correct dist files
- **Testing**: Always test with `npx devvit playtest`

## UI/UX Implementation
- Follow design system specifications and responsive requirements
- Use React for UI shell, Phaser for interactive elements
- Check existing UI patterns before implementing new components

## Error Handling Protocol
- Document all errors and solutions
- Include error details, root cause, and resolution steps
- For Devvit-specific errors, search documentation for solutions

## Task Completion Criteria
Mark tasks complete only when:
- All functionality implemented correctly
- Code follows project structure guidelines
- UI/UX matches specifications (if applicable)
- No errors or warnings remain
- Build and deploy successfully
- Tested on Reddit test environment

## Critical Rules
- **NEVER** skip documentation consultation
- **NEVER** ignore project structure guidelines
- **NEVER** use direct Express server creation (use Devvit's createServer)
- **NEVER** create files outside the established directory structure
- **ALWAYS** use proper Devvit patterns for server implementation
- **ALWAYS** test on Reddit test environment before marking complete
- **ALWAYS** follow the established workflow process

## Build Commands
```bash
npm run build        # Compile both client and server
npx devvit playtest  # Test on Reddit environment
npm run dev          # Development mode
npm run check        # Type check + lint + format
```