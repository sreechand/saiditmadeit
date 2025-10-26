import express from 'express';
import { 
  InitResponse, 
  IncrementResponse, 
  DecrementResponse,
  GeneratePuzzleRequest,
  GeneratePuzzleResponse,
  SubmitScoreRequest,
  SubmitScoreResponse,
  LeaderboardResponse
} from '../shared/types/api';
import { redis, reddit, createServer, context, getServerPort } from '@devvit/web/server';
import { createPost } from './core/post';
import { generatePuzzle, validatePuzzleCompleteness } from '../shared/utils/puzzleGenerator';
import { getThemeByName, getRandomValidTheme, getAvailableThemes } from '../shared/data/themes';

const app = express();

// Middleware for JSON body parsing
app.use(express.json());
// Middleware for URL-encoded body parsing
app.use(express.urlencoded({ extended: true }));
// Middleware for plain text body parsing
app.use(express.text());

const router = express.Router();

router.get<{ postId: string }, InitResponse | { status: string; message: string }>(
  '/api/init',
  async (_req, res): Promise<void> => {
    const { postId } = context;

    if (!postId) {
      console.error('API Init Error: postId not found in devvit context');
      res.status(400).json({
        status: 'error',
        message: 'postId is required but missing from context',
      });
      return;
    }

    try {
      const [count, username] = await Promise.all([
        redis.get('count'),
        reddit.getCurrentUsername(),
      ]);

      res.json({
        type: 'init',
        postId: postId,
        count: count ? parseInt(count) : 0,
        username: username ?? 'anonymous',
      });
    } catch (error) {
      console.error(`API Init Error for post ${postId}:`, error);
      let errorMessage = 'Unknown error during initialization';
      if (error instanceof Error) {
        errorMessage = `Initialization failed: ${error.message}`;
      }
      res.status(400).json({ status: 'error', message: errorMessage });
    }
  }
);

router.post<{ postId: string }, IncrementResponse | { status: string; message: string }, unknown>(
  '/api/increment',
  async (_req, res): Promise<void> => {
    const { postId } = context;
    if (!postId) {
      res.status(400).json({
        status: 'error',
        message: 'postId is required',
      });
      return;
    }

    res.json({
      count: await redis.incrBy('count', 1),
      postId,
      type: 'increment',
    });
  }
);

router.post<{ postId: string }, DecrementResponse | { status: string; message: string }, unknown>(
  '/api/decrement',
  async (_req, res): Promise<void> => {
    const { postId } = context;
    if (!postId) {
      res.status(400).json({
        status: 'error',
        message: 'postId is required',
      });
      return;
    }

    res.json({
      count: await redis.incrBy('count', -1),
      postId,
      type: 'decrement',
    });
  }
);

router.post('/internal/on-app-install', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      status: 'success',
      message: `Post created in subreddit ${context.subredditName} with id ${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

router.post('/internal/menu/post-create', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      navigateTo: `https://reddit.com/r/${context.subredditName}/comments/${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

// Snake Word Game API Endpoints

router.post<{}, GeneratePuzzleResponse | { status: string; message: string }, GeneratePuzzleRequest>(
  '/api/generate-puzzle',
  async (req, res): Promise<void> => {
    try {
      const { theme: themeName, difficulty } = req.body;

      // Validate request parameters
      if (!themeName || !difficulty) {
        res.status(400).json({
          status: 'error',
          message: 'Theme and difficulty are required'
        });
        return;
      }

      if (!['easy', 'medium', 'hard'].includes(difficulty)) {
        res.status(400).json({
          status: 'error',
          message: 'Invalid difficulty level. Must be easy, medium, or hard'
        });
        return;
      }

      // Get theme
      let theme;
      if (themeName === 'random') {
        theme = getRandomValidTheme();
      } else {
        theme = getThemeByName(themeName);
        if (!theme) {
          const availableThemes = getAvailableThemes();
          res.status(400).json({
            status: 'error',
            message: `Invalid theme "${themeName}". Available themes: ${availableThemes.join(', ')}`
          });
          return;
        }
      }

      // Check cache first
      const cacheKey = `puzzle:${theme.name}:${difficulty}:${Date.now() - (Date.now() % (5 * 60 * 1000))}`;
      const cachedPuzzle = await redis.get(cacheKey);
      
      if (cachedPuzzle) {
        try {
          const puzzle = JSON.parse(cachedPuzzle);
          res.json({
            type: 'puzzle',
            ...puzzle
          });
          return;
        } catch (parseError) {
          console.warn('Failed to parse cached puzzle, generating new one');
        }
      }

      // Generate new puzzle
      const puzzle = generatePuzzle(theme, { 
        difficulty,
        gridSize: 6,
        targetWordCount: 3,
        distractorWordCount: 2,
        maxAttempts: 50
      });

      // Validate puzzle completeness
      const validation = validatePuzzleCompleteness(puzzle);
      if (!validation.isValid) {
        console.error('Generated invalid puzzle:', validation.errors);
        res.status(500).json({
          status: 'error',
          message: 'Failed to generate valid puzzle'
        });
        return;
      }

      // Cache the puzzle for 5 minutes
      const puzzleData = {
        grid: puzzle.grid,
        targetWords: puzzle.targetWords,
        distractorWords: puzzle.distractorWords,
        theme: puzzle.theme,
        difficulty: {
          level: difficulty,
          showWords: difficulty === 'easy',
          showWordBlanks: difficulty === 'medium',
          snakeSpeed: difficulty === 'hard' ? 4 : difficulty === 'medium' ? 3 : 2,
          allowSharedLetters: false
        }
      };

      await redis.set(cacheKey, JSON.stringify(puzzleData));
      await redis.expire(cacheKey, 300); // 5 minutes cache

      res.json({
        type: 'puzzle',
        ...puzzleData
      });

    } catch (error) {
      console.error('Error generating puzzle:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to generate puzzle'
      });
    }
  }
);

router.post<{}, SubmitScoreResponse | { status: string; message: string }, SubmitScoreRequest>(
  '/api/submit-score',
  async (req, res): Promise<void> => {
    try {
      const { theme, score, timeElapsed, wrongLetters, difficulty } = req.body;

      // Validate request parameters
      if (!theme || typeof score !== 'number' || typeof timeElapsed !== 'number' || 
          typeof wrongLetters !== 'number' || !difficulty) {
        res.status(400).json({
          status: 'error',
          message: 'All fields are required: theme, score, timeElapsed, wrongLetters, difficulty'
        });
        return;
      }

      if (!['easy', 'medium', 'hard'].includes(difficulty)) {
        res.status(400).json({
          status: 'error',
          message: 'Invalid difficulty level'
        });
        return;
      }

      // Basic score validation (anti-cheat measures)
      if (score < 0 || score > 10000) {
        res.status(400).json({
          status: 'error',
          message: 'Invalid score value'
        });
        return;
      }

      if (timeElapsed < 10 || timeElapsed > 3600) { // 10 seconds to 1 hour
        res.status(400).json({
          status: 'error',
          message: 'Invalid time elapsed'
        });
        return;
      }

      if (wrongLetters < 0 || wrongLetters > 100) {
        res.status(400).json({
          status: 'error',
          message: 'Invalid wrong letters count'
        });
        return;
      }

      // Get current user
      const username = await reddit.getCurrentUsername();
      if (!username) {
        res.status(401).json({
          status: 'error',
          message: 'User authentication required'
        });
        return;
      }

      // Create score entry
      const scoreEntry = {
        username,
        score,
        timeElapsed,
        wrongLetters,
        difficulty,
        completedAt: Date.now()
      };

      // Store in Redis leaderboard (sorted set by score, descending)
      const leaderboardKey = `leaderboard:${theme}:${difficulty}`;
      const scoreKey = `${username}:${Date.now()}`;
      
      // Add to sorted set (higher scores first)
      await redis.zAdd(leaderboardKey, { score, member: scoreKey });
      
      // Store detailed score data
      const scoreDataKey = `score:${scoreKey}`;
      await redis.set(scoreDataKey, JSON.stringify(scoreEntry));
      await redis.expire(scoreDataKey, 86400 * 30); // 30 days

      // Keep only top 100 scores per theme/difficulty
      await redis.zRemRangeByRank(leaderboardKey, 0, -101);

      // Get user's position in leaderboard (note: Redis rank is 0-based)
      const userRank = await redis.zRank(leaderboardKey, scoreKey);
      
      const response: SubmitScoreResponse = {
        type: 'score-submitted',
        success: true
      };
      
      if (userRank !== null && userRank !== undefined) {
        response.leaderboardPosition = userRank + 1;
      }

      res.json(response);

    } catch (error) {
      console.error('Error submitting score:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to submit score'
      });
    }
  }
);

router.get<{ theme: string }, LeaderboardResponse | { status: string; message: string }>(
  '/api/leaderboard/:theme',
  async (req, res): Promise<void> => {
    try {
      const { theme } = req.params;
      const { difficulty = 'medium', limit = '10' } = req.query as { difficulty?: string; limit?: string };

      if (!theme) {
        res.status(400).json({
          status: 'error',
          message: 'Theme parameter is required'
        });
        return;
      }

      if (!['easy', 'medium', 'hard'].includes(difficulty)) {
        res.status(400).json({
          status: 'error',
          message: 'Invalid difficulty level'
        });
        return;
      }

      const limitNum = Math.min(Math.max(parseInt(limit) || 10, 1), 50); // 1-50 range

      // Get top scores from Redis sorted set (highest scores first)
      const leaderboardKey = `leaderboard:${theme}:${difficulty}`;
      const topScoreKeys = await redis.zRange(leaderboardKey, -(limitNum), -1);

      if (!topScoreKeys || topScoreKeys.length === 0) {
        res.json({
          type: 'leaderboard',
          scores: []
        });
        return;
      }

      // Get detailed score data for each entry
      const scores = [];
      for (const scoreKey of topScoreKeys) {
        const scoreDataKey = `score:${scoreKey}`;
        const scoreData = await redis.get(scoreDataKey);
        
        if (scoreData) {
          try {
            const parsedScore = JSON.parse(scoreData);
            scores.push(parsedScore);
          } catch (parseError) {
            console.warn(`Failed to parse score data for key ${scoreKey}`);
          }
        }
      }

      res.json({
        type: 'leaderboard',
        scores
      });

    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch leaderboard'
      });
    }
  }
);

// Use router middleware
app.use(router);

// Get port from environment variable with fallback
const port = getServerPort();

const server = createServer(app);
server.on('error', (err) => console.error(`server error; ${err.stack}`));
server.listen(port);
