import express from 'express';
import {User, UserModel} from '../models/User';
import * as userService from '../services/user';
import * as userRepository from '../repository/user';
import * as communityRepository from '../repository/community';
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
  const users = await userRepository.find();
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
  try {
    const results = await userService.joinCommunity(userId, communityId);
    res.json(results);
  } catch (error: any) {
    res.status(400).json({message: error.message});
  }
});

/**
 * @route DELETE /user/:userId/leave/:communityId
 * @param {string} userId - User ID
 * @param {string} communityId - Community ID
 * @description leaves a community
 */
userRouter.delete('/:userId/leave/:communityId', async (req, res) => {
  const {userId, communityId} = req.params;
  try {
    await userService.leaveCommunity(userId, communityId);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({message: error.message});
  }
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

  const result = await userRepository.create(newUser);
  res.send(result);
});

userRouter.post('/:userId/experience-points', async (req, res) => {
  const {userId} = req.params;
  const experiencePoint = req.body;

  if (!userId || !experiencePoint) {
    return res
      .status(400)
      .send({message: 'Missing userId or experiencePoints'});
  }

  try {
    const userExperiencePoint: {points: number; timestamp: Date} = {
      points: experiencePoint.points ?? 0,
      timestamp: new Date(experiencePoint.timestamp ?? Date.now()),
    };

    const updatedUser = await userService.updateExperiencePoints(
      userId,
      userExperiencePoint
    );
    res.send(updatedUser);
  } catch (error: any) {
    res.status(400).json({message: error.message});
  }
});

export {userRouter};
