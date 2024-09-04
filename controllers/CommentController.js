import prisma from "../DB/dbConfig.js";

export const getAllComments = async (req, res) => {
  const comments = await prisma.comment.findMany({
    include: {
      user: true,
      post: {
        include: {
          user: true,
        },
      },
    },
  });

  return res.json({ status: 200, data: comments });
};

//create comment
export const createComment = async (req, res) => {
  const { user_id, post_id, comment } = req.body;
  if(!user_id || !post_id || !comment){
    return res.json({
      status: 400,
      message: "All fields are required.",
    });
  }
  await prisma.post.update({
    where: {
      id: Number(post_id),
    },
    data: {
      comment_count: {
        increment: 1,
      },
    },
  });

  const newComent = await prisma.comment.create({
    data: {
      user_id: Number(user_id),
      post_id: Number(post_id),
      comment,
    },
  });

  return res.json({
    status: 200,
    data: newComent,
    msg: "Comment created successfully.",
  });
};

// get comment
export const getComment = async (req, res) => {
  const commentId = req.params.id;
  console.log(req);
  if(!commentId){
    return res.json({
      status: 400,
      message: "Comment ID is required.",
    });
  }
  const post = await prisma.comment.findFirst({
    where: {
      id: commentId,
    },
  });

  return res.json({ status: 200, data: post });
};

export const deleteComment = async (req, res) => {
  
  const { id, post_id } = req.query;
  if(!id || !post_id){
    return res.json({
      status: 400,
      message: "Comment ID post_id is required.",
    });
  }

  // Decress the comment counter
  await prisma.post.update({
    where: {
      id: Number(post_id),
    },
    data: {
      comment_count: {
        decrement: 1,
      },
    },
  });

  await prisma.comment.delete({
    where: {
      id:id,
    },
  });

  return res.json({ status: 200, msg: "Post deleted successfully" });
};
