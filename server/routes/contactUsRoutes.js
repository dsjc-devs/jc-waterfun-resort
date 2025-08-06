import express from "express";
import {
  createContact,
  getAllContacts,
  getSingleContactById,
} from "../controllers/contactUsControllers.js";

const router = express.Router();

router.post('/', createContact);
router.get('/', getAllContacts);
router.get('/:contactId', getSingleContactById);

export default router;