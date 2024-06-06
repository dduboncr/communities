import {User, UserModel} from '../models/User';

export const findById = async (id: string) => {
  const user = await UserModel.findById(id);

  return user;
};

export const find = () => {
  return UserModel.find();
};

export const create = async (user: User) => {
  return UserModel.create(user);
};
