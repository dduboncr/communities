import {User, UserModel} from '../models/User';

export const getUser = async (id: string) => {
  return UserModel.findById(id);
};

export const getUsers = (populate: string) => {
  if (!populate) {
    return UserModel.find();
  }

  return UserModel.find({}).populate(populate);
};

export const insertUser = async (user: User) => {
  return UserModel.create(user);
};
