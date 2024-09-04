import prisma from "../DB/db.config.js";

export const getAllPosts = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  if (page <= 0) {
    page = 1;
  }
  if (limit <= 0 || limit > 100) {
    limit = 10;
  }
  const skip = (page - 1) * limit;
  const posts = await prisma.post.findMany({
    skip: skip,
    take: limit,
    include: {
      comment: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      id: "desc",
    },
    where: {
      NOT: {
        title: {
          endsWith: "Blog",
        },
      },
    },
  });

  const totalPosts = await prisma.post.count();
  const totalPages = Math.ceil(totalPosts / limit);
  return res.json({
    status: 200,
    data: posts,
    meta: {
      totalPages,
      currentPage: page,
      limit: limit,
    },
  });
};

// create post
export const createPost = async (req, res) => {
  const { user_id, title, description } = req.body;

  if (!user_id || !title || !description) {
    return res.json({
      status: 400,
      message: "All fields are required.",
    });
  }

  const newPost = await prisma.post.create({
    data: {
      user_id: Number(user_id),
      title: title,
      description: description,
    },
  });

  return res.json({
    status: 200,
    data: newPost,
    msg: "Post created successfully.",
  });
};

// get post
export const getPost = async (req, res) => {
  const postId = req.params.id;

  // Validation for postId
  if (!postId) {
    return res.json({
      status: 400,
      message: "Post ID is required.",
    });
  }

  const post = await prisma.post.findFirst({
    where: {
      id: Number(postId),
    },
  });

  if (!post) {
    return res.json({
      status: 404,
      message: "Post not found.",
    });
  }

  return res.json({ status: 200, data: post });
};

// delete post
export const deletePost = async (req, res) => {
  const postId = req.params.id;

  // Validation for postId
  if (!postId) {
    return res.json({
      status: 400,
      message: "Post ID is required.",
    });
  }

  // Check if post exists
  const post = await prisma.post.findUnique({
    where: {
      id: Number(postId),
    },
  });

  if (!post) {
    return res.json({
      status: 404,
      message: "Post not found.",
    });
  }

  await prisma.post.delete({
    where: {
      id: Number(postId),
    },
  });

  return res.json({ status: 200, msg: "Post deleted successfully" });
};

// update post
export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { title, description } = req.body;

  // Validation for postId
  if (!postId) {
    return res.json({
      status: 400,
      message: "Post ID is required.",
    });
  }

  // Validation for empty fields
  if (!title && !description) {
    return res.json({
      status: 400,
      message: "At least one field is required.",
    });
  }

  await prisma.post.update({
    where: {
      id: Number(postId),
    },
    data: {
      title: title,
      description: description,
    },
  });

  return res.json({ status: 200, message: "Post updated successfully" });
};

// serach post
export const searchPost = async (req, res) => {
  const query = req.query.q;
  const posts = await prisma.post.findMany({
    where: {
      OR: [
        {
          description: {
            search: query,
          },
        },
        {
          title: {
            search: query,
          },
        },
      ],
    },
  });

  return res.json({ status: 200, data: posts });
};
