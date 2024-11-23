import { Schema, model, type Document, Types } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  isCorrectPassword(password: string): Promise<boolean>;
  blogs: Types.ObjectId[];
  blogCount: number;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,  // instantly creates a b-tree index on the username field for fast lookups 
  
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },

    blogs: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
      },
    ],
  
  },
  // set this to use virtual below
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// hash user password
userSchema.pre<IUser>('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});


userSchema.methods.isCorrectPassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.virtual('blogCount').get(function(this: IUser) {
  return this.blogs.length; 
})

const User = model<IUser>('User', userSchema);

export default User;

