import { Schema, model, type Document } from 'mongoose';
import dayjs from 'dayjs'; 


export interface IBlog extends Document {
    author: string;
    title: string;
    content: string;
    dateCreated: Date | string;

}

const blogSchema = new Schema<IBlog>(
    {
        author: {
            type: String,
            required: true,
            unique: true,
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
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


const Blog = model<IBlog>('Blog', blogSchema);

export default Blog;


/**
 * Advantages of Using author Instead of userId
Readability: The author is more human-readable than a database-generated userId.
Avoids Circular References in GraphQL: By storing a string like author instead of a full User object, you avoid creating deeply nested circular references in your GraphQL schema.
Simplified Queries: You can fetch blogs by the author's author directly without needing to resolve userId to author in your queries.

Disadvantages of Using author Instead of userId
Update Complexity: If the author ever changes (e.g., a user updates their author), you'll need to update all related Blog documents. This isn't an issue with an immutable userId.
Consistency Risk: If you allow usernames to change and forget to propagate updates, it could lead to inconsistencies.
Storage Redundancy: author might already exist in the User document, and duplicating it in the Blog documents could lead to slightly higher storage usage.
 
For purposes of this application, usernames will NOT be updatable eliminating 2/3 of the disadvantages.
I disagree with storge redundancy as the author is no more redundant than the userId, however this IS an example
of denormalization of a database (repeating data other than an ID)


*/