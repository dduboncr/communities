import {CommunityModel} from '../models/Community';
import {User} from '../models/User';
import * as communityRepository from '../repository/community';
import * as userRepository from '../repository/user';

export const leaveCommunity = async (userId: string, communityId: string) => {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const community = await communityRepository.findById(communityId);

  if (!community) {
    throw new Error('Community not found');
  }

  const userInCommunity = community?.users?.find(
    (userInCommunity) => userInCommunity._id.toString() === userId
  );

  if (!userInCommunity) {
    throw new Error('User is not in the community');
  }

  community.users = community.users.filter(
    (userInCommunity) => userInCommunity._id.toString() !== userId
  );

  await community?.save();
  user.community = undefined;
  await user?.save();

  return community;
};

export const joinCommunity = async (userId: string, communityId: string) => {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  if (user.community) {
    throw new Error('User is already in a community');
  }

  const community = await communityRepository.findById(communityId);

  const userInCommunity = community?.users?.find((user) => {
    return user._id.toString() === userId;
  });

  if (userInCommunity) {
    throw new Error('User is already in the community');
  }

  if (!community) {
    throw new Error('Community not found');
  }
  community.users.push(user);
  user.community = community;
  await user?.save();
  await community?.save();

  return community;
};

export const getCommunitiesLeaderboard = async () => {
  const leaderboard = await CommunityModel.find({}).populate('users');

  const rankedLeaderboard: {
    totalExperiencePoints: number;
    numberOfUsers: number;
    community: {name: string; logo: string};
  }[] = leaderboard
    .map((community) => {
      // sum of all users experience points, experience points is array of objects
      const totalExperiencePoints = (community.users as User[]).reduce(
        (acc, user) =>
          acc +
          user.experiencePoints.reduce((acc, point) => acc + point.points, 0),
        0
      );

      const numberOfUsers = community.users.length;

      return {
        totalExperiencePoints,
        numberOfUsers,
        community: {
          name: community.name,
          logo: community.logo,
        },
      };
    })
    .sort((a, b) => b.totalExperiencePoints - a.totalExperiencePoints);

  return rankedLeaderboard;
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
