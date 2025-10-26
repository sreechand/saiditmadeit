---
inclusion: fileMatch
fileMatchPattern: 'src/client/**/*'
---

# Client Development Guidelines

## Environment Constraints
- **Web-compatible dependencies only**: Use NPM dependencies that work in browser environments
- **No WebSockets**: WebSockets are not supported. For realtime functionality, use Devvit's realtime service (search devvit docs for "realtime")
- **Phaser for game engine**: Use Phaser 3 with TypeScript, strict typing enabled. Do not introduce other game engines

## Architecture
- This is the full-screen webview component of the Devvit app
- Communicate with server via `fetch(/my/api/endpoint)` calls
- Access server APIs written in `/src/server` through HTTP requests

## Technology Stack
- **React 18**: Primary UI framework
- **Phaser 3.90**: Game engine for interactive elements (sliders, animations)
- **TypeScript**: Strict typing enabled
- **Tailwind CSS**: Utility-first styling
- **Vite**: Build tool and dev server

## Best Practices
- Mobile-first responsive design
- Use React hooks and functional components
- Leverage Phaser for interactive game canvas elements
- Implement proper error handling for API calls
- Follow the existing component structure in `/src/client/components/`