import expressAsnc from "express-async-handler";
import passwordServices from "../services/passwordServices.js";

const changePassword = expressAsnc(async (req, res) => {
  try {
    const response = await passwordServices.changePassword(req.body);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

export {
  changePassword
};
