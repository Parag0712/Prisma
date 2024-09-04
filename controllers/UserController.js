import prisma from "../DB/dbConfig.js";

export const getAllUsers = async (req, res) => {

  // This code is using Prisma to fetch all users from the database. 
  // The `findMany` method is used to retrieve multiple records.
  // The `select` option is used to specify the fields to include in the result.
  // In this case, we're selecting the count of related records, specifically posts and comments.
  // This allows us to include the count of posts and comments for each user in the result.
  const users = await prisma.user.findMany(
    {
      select:{
        _count:{
          select:{
            posts:true,
            comments:true
          }
        }
      }
    }
  );

  if (!users) {
    return res.json({
      status: 404,
      message: "No users found.",
    });
  }
  return res.json({ status: 200, data: users });
}

// create User
export const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Validation for empty fields
  if (!name || !email || !password) {
    return res.json({
      status: 400,
      message: "All fields are required.",
    });
  }

  // Validation for email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.json({
      status: 400,
      message: "Invalid email format.",
    });
  }

  // Validation for password length
  if (password.length < 6) {
    return res.json({
      status: 400,
      message: "Password must be at least 6 characters.",
    });
  }

  const findOne = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (findOne) {
    return res.json({
      status: 400,
      message: "Email Already Taken . please another email.",
    });
  }

  const newUser = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: password,
    },
  });

  if (newUser) {
    return res.json({ status: 200, data: newUser, msg: "User created." });
  }
};

// getUser
export const getUser = async (req, res) => {
  const userId = req.params.id;

  // Validation for userId
  if (!userId) {
    return res.json({
      status: 400,
      message: "User ID is required.",
    });
  }

  const user = await prisma.user.findFirst({
    where: {
      id: Number(userId),
    },
  });

  if (!user) {
    return res.json({
      status: 404,
      message: "User not found.",
    });
  }

  return res.json({ status: 200, data: user });
};

// update User
export const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { name, email, password } = req.body;

  // Validation for userId
  if (!userId) {
    return res.json({
      status: 400,
      message: "User ID is required.",
    });
  }

  // Validation for empty fields
  if (!name && !email && !password) {
    return res.json({
      status: 400,
      message: "At least one field is required.",
    });
  }

  // Validation for email format
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(email)) {
    return res.json({
      status: 400,
      message: "Invalid email format.",
    });
  }

  // Validation for password length
  if (password && password.length < 8) {
    return res.json({
      status: 400,
      message: "Password must be at least 8 characters.",
    });
  }

  // email is uniq that's why we use FindUnique
  //   use index in database
  const findOne = await prisma.user.findUnique({
    where:{
        email: email,
    }
  });

  if (findOne) {
    return res.json({
      status: 400,
      message: "Email Already Taken . please another email.",
    });
  }

  await prisma.user.update({
    where: {
      id: Number(userId),
    },
    data: {
      name: name,
      email: email,
      password: password,
    },
  });

  return res.json({ status: 200, message: "User updated successfully" });
};

// delete User
export const deleteUser = async (req, res) => {
  const userId = req.params.id;

  // Validation for userId
  if (!userId) {
    return res.json({
      status: 400,
      message: "User ID is required.",
    });
  }

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
  });

  if (!user) {
    return res.json({
      status: 404,
      message: "User not found.",
    });
  }

  await prisma.user.delete({
    where: {
      id: Number(userId),
    },
  });

  return res.json({ status: 200, msg: "User deleted successfully" });
};
