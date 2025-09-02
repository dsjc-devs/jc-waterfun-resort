import { v4 as uuidv4 } from 'uuid';
import { USER_ROLES } from '../constants/constants.js';
import Users from '../models/usersModels.js';
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

  if (user.status !== "ACTIVE") {
    throw new Error("Account is not active. Please contact support.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const userObj = user.toObject();
  delete userObj.password;

  const token = jwt.sign(
    { userId: user.userId, emailAddress: user.emailAddress, ...userObj },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

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
    phoneNumber,
    avatar,
    status,
    password,
    position,
  } = userData || {};

  const positionArr = []

  switch (position) {
    case "MASTER_ADMIN":
      positionArr.push({ label: USER_ROLES.MASTER_ADMIN.label, value: USER_ROLES.MASTER_ADMIN.value })
      break;

    case "RECEPTIONIST":
      positionArr.push({ label: USER_ROLES.RECEPTIONIST.label, value: USER_ROLES.RECEPTIONIST.value })
      break;

    case "ADMIN":
      positionArr.push({ label: USER_ROLES.ADMIN.label, value: USER_ROLES.ADMIN.value })
      break;

    default:
      positionArr.push({ label: USER_ROLES.CUSTOMER.label, value: USER_ROLES.CUSTOMER.value })
      break;
  }

  const userId = uuidv4();

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await Users.create({
      userId,
      firstName,
      lastName,
      emailAddress,
      phoneNumber,
      avatar,
      status,
      password: hashedPassword,
      position: positionArr,
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

    if (filters["position.value"]) {
      const values = filters["position.value"].split(",");
      filters["position.value"] =
        values.length > 1 ? { $in: values } : { $eq: values[0] };
    }

    const users = await Users.aggregate([
      { $match: filters },

      {
        $addFields: {
          positionRank: {
            $switch: {
              branches: [
                {
                  case: { $in: ["MASTER_ADMIN", "$position.value"] },
                  then: 0
                },
                {
                  case: { $in: ["ADMIN", "$position.value"] },
                  then: 1
                },
                {
                  case: { $in: ["RECEPTIONIST", "$position.value"] },
                  then: 2
                }
              ],
              default: 99
            }
          },
          statusRank: {
            $switch: {
              branches: [
                { case: { $eq: ["ACTIVE", "$status"] }, then: 0 },
                { case: { $eq: ["INACTIVE", "$status"] }, then: 1 },
                { case: { $eq: ["ARCHIVED", "$status"] }, then: 2 },
                { case: { $eq: ["BANNED", "$status"] }, then: 3 }
              ],
              default: 99
            }
          }
        }
      },

      // Sort by positionRank → statusRank → createdAt (desc)
      { $sort: { positionRank: 1, statusRank: 1, createdAt: -1 } },

      { $skip: skip },
      { $limit: limit },

      {
        $project: {
          password: 0,
          positionRank: 0,
          statusRank: 0
        }
      }
    ]);

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
  const mapPositionToRole = (position) => {
    switch (position) {
      case "MASTER_ADMIN":
        return { label: USER_ROLES.MASTER_ADMIN.label, value: USER_ROLES.MASTER_ADMIN.value };

      case "RECEPTIONIST":
        return { label: USER_ROLES.RECEPTIONIST.label, value: USER_ROLES.RECEPTIONIST.value };

      case "ADMIN":
        return { label: USER_ROLES.ADMIN.label, value: USER_ROLES.ADMIN.value };

      default:
        return { label: USER_ROLES.CUSTOMER.label, value: USER_ROLES.CUSTOMER.value };
    }
  };

  try {
    const allowedFields = ["firstName", "lastName", "emailAddress", "phoneNumber", "avatar", "position", "status"];
    const updates = {};

    for (const key of allowedFields) {
      if (userData[key] !== undefined) {
        if (key === "position") {
          const roleObj = mapPositionToRole(userData.position);

          const user = await Users.findOne({ userId });
          const currentPositions = user.position || [];

          const filteredPositions = currentPositions.filter(pos => pos.value !== roleObj.value);

          updates.position = [roleObj, ...filteredPositions];
        } else {
          updates[key] = userData[key];
        }
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

    return {
      message: `User with an ID of ${userId} successfully updated.`,
      updatedUser
    };
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
