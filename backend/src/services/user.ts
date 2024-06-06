import {User, UserModel} from '../models/User';
import * as communityRepository from '../repository/community';
import * as userRepository from '../repository/user';

export const leaveCommunity = async (userId: string, communityId: string) => {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  if (!user.community) {
    return user;
  }

  if (user.community._id.toString() !== communityId) {
    throw new Error('User is not in the community');
  }

  user.community = undefined;

  await user?.save();

  return user;
};

export const joinCommunity = async (userId: string, communityId: string) => {
  const user = await userRepository.findById(userId);

  if (user?.community) {
    console.log('user already in community');
    throw new Error('User already in a community');
  }

  const community = await communityRepository.findById(communityId);

  if (!user || !community) {
    console.log('user or community not found');
    return;
  }

  user.community = community;

  await user?.save();

  return user;
};

export const getCommunitiesLeaderboard = async () => {
  const leaderboard = await UserModel.aggregate([
    {
      $unwind: '$experiencePoints',
    },
    {
      $group: {
        _id: '$community',
        totalExperiencePoints: {$sum: '$experiencePoints.points'},
        numberOfUsers: {$sum: 1},
      },
    },
    {
      $lookup: {
        from: 'communities',
        localField: '_id',
        foreignField: '_id',
        as: 'community',
      },
    },
    {
      $sort: {totalExperiencePoints: -1},
    },
  ]);

  return leaderboard.map((item) => ({
    ...item,
    community: item.community[0],
  }));
};

export const updateExperiencePoints = async (
  userId: string,
  experiencePoint: {points: number; timestamp: Date}
) => {
  const user = await userRepository.findById(userId);

  if (!user) {
    console.log('user not found');
    throw new Error('User not found');
  }

  if (!user.experiencePoints) {
    user.experiencePoints = [];
  }

  user.experiencePoints.push(experiencePoint);
  await user?.save();

  const updatedUser = await userRepository.findById(userId);
  return updatedUser;
};
