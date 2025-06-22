import expressAsync from "express-async-handler";
import userServices from '../services/userServices.js';

const createUser = expressAsync(async (req, res) => {
  try {
    const response = await userServices.createUser(req.body);
    res.json(response)
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
    const response = await userServices.getSingleUserById(req.params.userId);
    res.json(response)
  } catch (error) {
    console.error(error);
    throw new Error(error)
  }
});

const updateUserById = expressAsync(async (req, res) => {
  try {
    const response = await userServices.updateUserById(req.params.userId, req.body);
    res.json(response)
  } catch (error) {
    console.error(error);
    throw new Error(error)
  }
});

const deleteUserById = expressAsync(async (req, res) => {
  try {
    const response = await userServices.deleteUserById(req.params.userId);
    res.json(response)
  } catch (error) {
    console.error(error);
    throw new Error(error)
  }
});

export {
  createUser,
  getUsers,
  getSingleUserById,
  updateUserById,
  deleteUserById
}