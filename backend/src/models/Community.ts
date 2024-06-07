import {prop, getModelForClass, Ref} from '@typegoose/typegoose';
import {User} from './User';

export class Community {
  @prop({required: true})
  public name!: string;

  @prop({required: true})
  public logo!: string;

  @prop({
    required: false,
    ref: () => User,
    default: [],
    select: true,
  })
  public users!: Ref<User>[];
}

export const CommunityModel = getModelForClass(Community);
