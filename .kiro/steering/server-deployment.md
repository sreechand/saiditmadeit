---
inclusion: fileMatch
fileMatchPattern: 'src/server/**/*'
---

# Server Development Guidelines

## Serverless Environment
- **Serverless Node.js runtime**: Similar to AWS Lambda execution model
- **Read-only filesystem**: Cannot write files to disk
- **No stateful processes**: Do not use SQLite or in-memory state that persists between requests

## Available APIs
- **Node.js globals**: All standard Node.js globals available except restricted modules
- **Redis access**: Use `import { redis } from '@devvit/web/server'` for data persistence
- **Fetch API**: Use `fetch()` instead of `http` or `https` modules

## Restricted Modules
- **File system**: `fs` module not available
- **HTTP modules**: `http`, `https`, `net` modules not supported
- **WebSockets**: Not supported in this environment
- **HTTP streaming**: Not supported

## Architecture Patterns
- **Stateless functions**: Each request should be independent
- **Redis for persistence**: Use Redis for all data storage and caching
- **RESTful APIs**: Expose endpoints that client can call via fetch
- **Background jobs**: Use Devvit's scheduler for timed operations

## Best Practices
- Use Express 5 for routing and middleware
- Implement proper error handling and validation
- Use Zod schemas for request/response validation
- Structure services in `/src/server/core/services/`
- For realtime features, consult Devvit docs for realtime service options