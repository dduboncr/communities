import {Community, CommunityModel} from '../models/Community';

export const findById = async (id: string) => {
  return CommunityModel.findById(id);
};

export const insertCommunity = async (community: Community) => {
  return CommunityModel.create(community);
};
