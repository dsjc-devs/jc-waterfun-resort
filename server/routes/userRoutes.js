import express from 'express';
import { createValidator } from '../middleware/validations/userValidator.js'

import {
  createUser,
  getUsers,
  getSingleUserById,
  updateUserById,
  deleteUserById
} from '../controllers/userControllers.js'
import createUploadMiddleware from '../middleware/multer/uploadMiddleware.js'

const router = express.Router();

router.post(
  '/create',
  createUploadMiddleware({
    fields: [
      { name: 'avatar', maxCount: 1 },
    ],
    fieldFolders: {
      avatar: 'user_avatars',
    },
  }),
  createValidator,
  createUser
);

router.get('/', getUsers)

router.get('/:userId', getSingleUserById)
router.patch('/:userId', updateUserById)
router.delete('/:userId', deleteUserById)

export default router