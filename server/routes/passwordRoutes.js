import express from "express";
import { changePassword } from "../controllers/passwordControllers.js";
import { changePasswordValidator } from "../middleware/validations/passwordValidator.js";

const router = express.Router();

router.post(
  '/change-password',
  changePasswordValidator,
  changePassword
);

export default router;