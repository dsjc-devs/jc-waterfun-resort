import Users from '../models/usersModels.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const authUser = async (data) => {
  const { emailAddress, password } = data || {};

  if (!emailAddress || !password) {
    throw new Error("Email and password are required");
  }

  const user = await Users.findOne({ emailAddress });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const userObj = user.toObject();
  delete userObj.password;

  const token = jwt.sign(
    { userId: user.userId, emailAddress: user.emailAddress },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  console.log('JWT_SECRET used to verify:', process.env.JWT_SECRET);
  console.log('Token:', token);

  return {
    message: "Authentication successful",
    user: userObj,
    token,
  };
};

const createUser = async (userData) => {
  const {
    firstName,
    lastName,
    emailAddress,
    avatar,
    status,
    password,
    position,
  } = userData || {};

  const userId = uuidv4();

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await Users.create({
      userId,
      firstName,
      lastName,
      emailAddress,
      avatar,
      status,
      password: hashedPassword,
      position,
    });

    return user;
  } catch (error) {
    console.error("Error creating user:", error.message);
    throw new Error(error);
  }
};

const getUsers = async (queryObject) => {
  try {
    const page = parseInt(queryObject.page) || 1;
    const limit = parseInt(queryObject.limit) || 10;
    const skip = (page - 1) * limit;

    const { page: _page, limit: _limit, ...filters } = queryObject;

    const users = await Users.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-password");

    const totalCount = await Users.countDocuments(filters);

    return {
      users,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalUsers: totalCount
    };
  } catch (error) {
    console.error("Error getting users:", error.message);
    throw new Error(error);
  }
};

const getSingleUserById = async (userId) => {
  try {
    const user = await Users.findOne({ userId })

    if (!user) {
      throw new Error(`[Users] not found!`)
    }

    return user
  } catch (error) {
    console.error("Error getting user:", error.message);
    throw new Error(error);
  }
}

const updateUserById = async (userId, userData) => {
  try {
    const allowedFields = ["firstName", "lastName", "emailAddress", "avatar", "position", "status"];
    const updates = {};

    for (const key of allowedFields) {
      if (userData[key] !== undefined) {
        updates[key] = userData[key];
      }
    }

    const updatedUser = await Users.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return `User with an ID of ${userId} successfully updated.`
  } catch (error) {
    console.error("Error updating user:", error.message);
    throw new Error(error);
  }
};

const deleteUserById = async (userId) => {
  try {
    const user = await getSingleUserById(userId)
    const deletedUser = await Users.findOneAndDelete({ userId: user.userId });

    return `User with an ID of ${deletedUser.userId} deleted successfully`
  } catch (error) {
    console.error("Error deleting user:", error.message);
    throw new Error("Failed to delete user");
  }
};

export default {
  authUser,
  createUser,
  getUsers,
  getSingleUserById,
  updateUserById,
  deleteUserById
};
