import { User, Blog, Comment } from "../models/index.js";
import type IUserDocument from "../interfaces/UserDocument";
import type IUserContext from "../interfaces/UserContext";
import type IBlogInput from "../interfaces/BlogInput";
import type IBlogDocument from "../interfaces/BlogDocument.js";
import type ICommentDocument from "../interfaces/CommentDocument.js";
import { signToken } from "../services/auth.js";
import { GraphQLError } from "graphql";
import { Types } from "mongoose";
import { IResolvers } from "@graphql-tools/utils";

const resolvers: IResolvers = {
  Query: {
    me: async (
      _parent: any,
      _args: any,
      context: IUserContext
    ): Promise<IUserDocument | null> => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v")
          .populate({
            path: "blogs",
            model: Blog,
          });

        return userData as IUserDocument;
      }
      throw new GraphQLError("You are not authorized to perform this action.", {
        extensions: {
          code: "FORBIDDEN",
        },
      });
    },
  },
  Mutation: {
    addUser: async (
      _parent: any,
      args: any
    ): Promise<{ token: string; user: IUserDocument }> => {
      const user = await User.create(args);
      const token = signToken(
        user.username,
        user.email,
        user._id as Types.ObjectId
      );

      return { token, user: user as IUserDocument };
    },
    login: async (
      _parent: any,
      { email, password }: { email: string; password: string }
    ): Promise<{ token: string; user: IUserDocument }> => {
      const user = await User.findOne({ email });

      if (!user || !(await user.isCorrectPassword(password))) {
        throw new GraphQLError("Your credentials are incorrect.", {
          extensions: {
            code: "UNAUTHORIZED",
          },
        });
      }

      const token = signToken(
        user.username,
        user.email,
        user._id as Types.ObjectId
      );
      return { token, user: user as IUserDocument };
    },
    addBlog: async (
      _parent: any,
      { blogData }: { blogData: IBlogInput },
      context: IUserContext
    ): Promise<IBlogDocument | null> => {
      if (context.user) {
        const newBlog = await Blog.create(blogData);

        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { blogs: newBlog._id } },
          { new: true }
        );
        return newBlog as IBlogDocument;
      }
      throw new GraphQLError("You are not authorized to perform this action.", {
        extensions: {
          code: "FORBIDDEN",
        },
      });
    },
    addComment: async (
      parent: any,
      {
        blogId,
        content,
        author,
      }: { blogId: Types.ObjectId; content: string; author: string },
      context: IUserContext
    ): Promise<ICommentDocument | null> => {
      if (context.user) {
        const comment = await Comment.create({
          blogId,
          content,
          author,
        });
        comment.path = `${comment._id}`; // Set path to the comment's `_id`
        await comment.save();
        return comment as ICommentDocument;
      }
      throw new GraphQLError("You are not authorized to perform this action.", {
        extensions: {
          code: "FORBIDDEN",
        },
      });
    },
    addReply: async (
      parent: any,
      {
        blogId,
        parentCommentId,
        content,
        author,
      }: {
        blogId: Types.ObjectId;
        content: string;
        author: string;
        parentCommentId: Types.ObjectId;
      },
      context: IUserContext
    ): Promise<ICommentDocument | null> => {
      if (context.user) {
        const parentComment = await Comment.findById(parentCommentId);
        if (!parentComment) throw new Error("Parent comment not found");

        const reply = await Comment.create({
          blogId,
          content,
          author,
        });
        reply.path = `${parentComment.path}/${reply._id}`;
        await reply.save();
        return reply as ICommentDocument;
      }
      throw new GraphQLError("You are not authorized to perform this action.", {
        extensions: {
          code: "FORBIDDEN",
        },
      });
    },
  },
};

export default resolvers;
