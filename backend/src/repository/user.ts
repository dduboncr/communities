import {User, UserModel} from '../models/User';

export const findById = async (id: string) => {
  const user = await UserModel.findById(id);

  return user;
};

export const find = (filter: Partial<User> = {}) => {
  return UserModel.find({...filter});
};

export const create = async (user: User) => {
  return UserModel.create(user);
};
