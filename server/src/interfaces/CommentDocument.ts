import { Types } from "mongoose";
export default interface ICommentDocument {
  _id: Types.ObjectId;
  content: string;
  blogId: Types.ObjectId;
  author: string;
  path: string;
  dateCreated: Date | string;
}
