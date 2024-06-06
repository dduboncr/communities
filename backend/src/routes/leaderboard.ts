import {Router} from 'express';
import {getCommunitiesLeaderboard} from '../services/user';

const leaderboardRouter = Router();

leaderboardRouter.get('/', async (req, res) => {
  const leaderboard = await getCommunitiesLeaderboard();

  res.json({leaderboard});
});

export {leaderboardRouter};
