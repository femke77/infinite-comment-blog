import type { Comment } from "../interfaces/Comment";

function buildCommentTree(comments: Comment[]): Comment[] {
  const commentMap = new Map();

  // Create a map of all comments by their ID
  comments.forEach((comment) => {
    commentMap.set(comment._id, { ...comment, children: [] });
  });

  const rootComments: Comment[] = [];

  comments.forEach((comment) => {
    const pathParts = comment.path.split("/");
    if (pathParts.length === 1) {
      // Top-level comment
      rootComments.push(commentMap.get(comment._id));
    } else {
      // Nested comment
      const parentId = pathParts[pathParts.length - 2];
      const parentComment = commentMap.get(parentId);
      if (parentComment) {
        parentComment.children.push(commentMap.get(comment._id));
      }
    }
  });

  return rootComments;
}

export default buildCommentTree;
