import { Schema, type Document, Types, model} from 'mongoose';
import dayjs from 'dayjs';

export interface IComment extends Document {
    blogId: Types.ObjectId;
    path: string;
    author: string;
    content: string;
    dateCreated: Date | string;

}

const commentSchema = new Schema<IComment>(
    {
        blogId: { type: Schema.Types.ObjectId, ref: 'Blog', required: true }, // Associated blog
        path: { type: String, required: true }, // Materialized path
        content: { type: String, required: true }, 
        author: { type: String, required: true }, 
        dateCreated: {
            type: Date,
            default: Date.now,
            get: (timestamp: Date): string => dayjs(timestamp).format('MMM DD, YYYY [at] hh:mm A'),
        },

    },

    {
        toJSON: {
            getters: true
        },
    }
);


const Comment = model<IComment>('Comment', commentSchema);

export default Comment;


/*
*/