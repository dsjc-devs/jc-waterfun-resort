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

export {
  createUser
}