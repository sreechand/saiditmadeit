import { context, reddit } from '@devvit/web/server';

export const createPost = async () => {
  const { subredditName } = context;
  if (!subredditName) {
    throw new Error('subredditName is required');
  }

  return await reddit.submitCustomPost({
    splash: {
      // Splash Screen Configuration for Snake Word Game
      appDisplayName: 'Snake Word Game',
      backgroundUri: 'default-splash.png',
      buttonLabel: 'Start Playing',
      description: 'Guide your snake through letters to discover hidden themed words!',
      heading: 'Snake Word Puzzle',
      appIconUri: 'default-icon.png',
    } as any, // Temporary type assertion to handle version mismatch
    postData: {
      gameState: 'initial',
      theme: 'Animals',
      difficulty: 'medium',
    },
    subredditName: subredditName,
    title: 'Snake Word Game - Find the Hidden Words!',
  });
};
