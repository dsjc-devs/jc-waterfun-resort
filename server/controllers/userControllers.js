import expressAsync from "express-async-handler";
import userServices from '../services/userServices.js';
import { getUserRole } from '../middleware/permissions.js';

const authUser = expressAsync(async (req, res) => {
  try {
    const response = await userServices.authUser(req.body)
    res.json(response)
  } catch (error) {
    console.log(error);
    throw new Error(error)
  }
})

const createUser = expressAsync(async (req, res) => {
  try {
    const avatar = req.files && req.files['avatar'] ? req.files['avatar'][0].path : "";
    const payload = { ...req.body, avatar }

    const user = await userServices.createUser(payload);
    res.json({ user, message: "User successfully created." })
  } catch (error) {
    console.error(error);
    throw new Error(error)
  }
});

const getUsers = expressAsync(async (req, res) => {
  try {
    const response = await userServices.getUsers(req.query);
    res.json(response)
  } catch (error) {
    console.error(error);
    throw new Error(error)
  }
});

const getSingleUserById = expressAsync(async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const response = await userServices.getSingleUserById(targetUserId);
    res.json(response)
  } catch (error) {
    console.error(error);
    throw new Error(error)
  }
});

const updateUserById = expressAsync(async (req, res) => {
  try {
    const avatar =
      req.files && req.files['avatar']
        ? req.files['avatar'][0].path
        : req.body.avatar;

    const userRole = getUserRole(req.user);
    const targetUserId = req.params.userId;

    const targetUser = await userServices.getSingleUserById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const targetRole = targetUser.position[0].value;
    req.targetUserRole = targetRole;

    if (userRole === 'CUSTOMER') {
      if (req.user.userId !== targetUserId) {
        return res.status(403).json({ message: "You can only update your own profile" });
      }
      delete req.body.position;
      delete req.body.status;
    }

    if ((targetRole === 'ADMIN' || targetRole === 'MASTER_ADMIN') && userRole !== 'MASTER_ADMIN') {
      return res.status(403).json({ message: "Only Master Admin can update Admin accounts" });
    }

    if (targetRole === 'RECEPTIONIST' && userRole !== 'MASTER_ADMIN' && userRole !== 'ADMIN') {
      return res.status(403).json({ message: "Only Master Admin or Admin can update Receptionist accounts" });
    }

    const payload = { ...req.body, avatar, updatedBy: req.user.userId }

    const response = await userServices.updateUserById(targetUserId, payload);
    res.json(response)
  } catch (error) {
    console.error(error);
    throw new Error(error)
  }
});

const deleteUserById = expressAsync(async (req, res) => {
  try {
    const userRole = getUserRole(req.user);
    const targetUserId = req.params.userId;

    const targetUser = await userServices.getSingleUserById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const targetRole = targetUser.position[0].value;

    if ((targetRole === 'ADMIN' || targetRole === 'MASTER_ADMIN') && userRole !== 'MASTER_ADMIN') {
      return res.status(403).json({ message: "Only Master Admin can delete Admin accounts" });
    }

    if (targetRole === 'RECEPTIONIST' && userRole !== 'MASTER_ADMIN' && userRole !== 'ADMIN') {
      return res.status(403).json({ message: "Only Master Admin or Admin can delete Receptionist accounts" });
    }

    if (req.user.userId === targetUserId) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    const response = await userServices.deleteUserById(targetUserId);
    res.json(response)
  } catch (error) {
    console.error(error);
    throw new Error(error)
  }
});

export {
  authUser,
  createUser,
  getUsers,
  getSingleUserById,
  updateUserById,
  deleteUserById
}