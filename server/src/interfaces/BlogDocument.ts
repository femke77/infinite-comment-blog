import { Types } from "mongoose";

export default interface IBlogDocument {
    _id: Types.ObjectId;
    author: string;
    title: string;
    content: string;
  }
  