import {getCommunity} from '../repository/community';
import {getUser, getUsers} from '../repository/user';

export const leaveCommunity = async (userId: string, communityId: string) => {
  return;
};

export const joinCommunity = async (userId: string, communityId: string) => {
  const user = await getUser(userId);
  console.log('found user', user);

  const community = await getCommunity(communityId);
  console.log('found community', community);

  if (!user || !community) {
    console.log('user or community not found');
    return;
  }

  console.log('found user and community');
  user.community = community;

  await user?.save();

  return user;
};
