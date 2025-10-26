# Development Workflow and Architecture

## Project Structure Overview
The codebase follows a monorepo structure with three main development areas:

### Core Development Folders
- **`/src/client`**: Full-screen webview (React + Phaser frontend)
  - Communicates with server via `fetch(/my/api/endpoint)` calls
  - Access server APIs through HTTP requests
  
- **`/src/server`**: Serverless Node.js backend
  - Access Redis for data persistence
  - Expose APIs for client consumption
  
- **`/src/shared`**: Shared code between all components
  - Common types, utilities, and constants
  - Shared between devvit app, client, server, and webview

## Development Assumptions
- **Configuration is working**: Assume TypeScript, Vite, Tailwind, ESLint, and Prettier are properly configured
- **Focus on code logic**: If there are issues, they're more likely in your code than the build configuration
- **Use existing tooling**: Leverage the established development environment

## Communication Patterns
- **Client â†” Server**: HTTP requests via fetch API
- **Data persistence**: Redis through server-side services
- **Shared logic**: Import from `/src/shared` for common functionality

## Development Commands
```bash
npm run dev          # Start development servers
npm run build        # Build all components
npm run check        # Type check + lint + format
npm run test         # Run test suite
```

## Code Organization
- Follow the established folder structure
- Use TypeScript with strict typing
- Implement proper error handling
- Write tests for critical functionality
- Follow existing naming conventions and patterns