import express from 'express';
import {UserModel} from '../models/User';
import {joinCommunity} from '../services/user';
import {getUsers, insertUser} from '../repository/user';

const userRouter = express.Router();

/**
 * @route GET /user/:id
 * @param {string} id - User ID
 * @returns {User} - User object with experiencePoints field
 */
userRouter.get('/:id', async (req, res) => {
  const user = await UserModel.findById(req.params.id).select(
    '+experiencePoints'
  );
  if (!user) {
    return res.status(404).send({message: 'User not found'});
  }
  res.send(user);
});

/**
 * @route GET /user
 * @returns {Array} - Array of User objects
 * @note Adds the virtual field of totalExperience to the user.
 * @hint You might want to use a similar aggregate in your leaderboard code.
 */
userRouter.get('/', async (_, res) => {
  // const users = await UserModel.aggregate([
  //   {
  //     $unwind: '$experiencePoints',
  //   },
  //   {
  //     $group: {
  //       _id: '$_id',
  //       email: {$first: '$email'},
  //       profilePicture: {$first: '$profilePicture'},
  //       totalExperience: {$sum: '$experiencePoints.points'},
  //     },
  //   },
  // ]);

  const users = await getUsers('community');
  res.send(users);
});

/**
 * @route POST /user/:userId/join/:communityId
 * @param {string} userId - User ID
 * @param {string} communityId - Community ID
 * @description Joins a community
 */
userRouter.post('/:userId/join/:communityId', async (req, res) => {
  const {userId, communityId} = req.params;

  if (!userId || !communityId) {
    return res.status(400).send({message: 'Missing userId or communityId'});
  }

  const results = await joinCommunity(userId, communityId);

  res.json(results);
});

/**
 * @route DELETE /user/:userId/leave/:communityId
 * @param {string} userId - User ID
 * @param {string} communityId - Community ID
 * @description leaves a community
 */
userRouter.delete('/:userId/leave/:communityId', async (req, res) => {
  const {userId, communityId} = req.params;
  // TODO: Implement the functionality to leave a community
  res.status(501).send();
});

userRouter.post('/', async (req, res) => {
  const user = req.body;

  if (!user.email || !user.password) {
    return res.status(400).send({message: 'Missing email or password'});
  }

  const newUser = new UserModel({
    email: user.email,
    passwordHash: user.password,
    experiencePoints: [],
    profilePicture: '',
    community: undefined,
  });

  const result = await insertUser(newUser);
  res.send(result);
});

export {userRouter};
