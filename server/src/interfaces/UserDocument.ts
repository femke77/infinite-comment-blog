import { IBlog } from '../models/Blog.js';
import { Types } from 'mongoose';

export default interface IUserDocument {
 _id: Types.ObjectId;
  username: string | null;
  email: string | null;
  blogs: Types.ObjectId[] | IBlog[] | null;
  isCorrectPassword(password: string): Promise<boolean>;
  blogCount: number | null;
}
