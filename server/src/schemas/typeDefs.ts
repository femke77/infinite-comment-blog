import { gql } from "graphql-tag";

const typeDefs = gql`
  type Query {
    me: User
    blogs: [Blog]
    blog(blogId: ID!): Blog
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addBlog(blogData: BlogInput): Blog
    addComment(blogId: ID!, content: String!, author: String!): Comment
    addReply(
      blogId: ID!
      parentCommentId: ID!
      content: String!
      author: String!
    ): Comment
  }

  type User {
    _id: ID
    username: String!
    email: String!
    blogCount: Int
    blogs: [Blog]
  }

  type Blog {
    _id: ID
    author: String!
    title: String!
    content: String!
    dateCreated: String
    comments: [Comment]
    
  }

  type Comment {
    _id: ID
    blogId: ID
    author: String!
    content: String!
    dateCreated: String
    path: String 
  }

  type Auth {
    token: ID!
    user: User
  }

  input BlogInput {
    author: String!
    title: String!
    content: String!
  }
`;

export default typeDefs;
