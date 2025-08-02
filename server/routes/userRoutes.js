import express from 'express';
import { createValidator } from '../middleware/validations/userValidator.js'
import { protect } from '../middleware/authMiddleware.js'

import {
  authUser,
  createUser,
  getUsers,
  getSingleUserById,
  updateUserById,
  deleteUserById
} from '../controllers/userControllers.js'
import createUploadMiddleware from '../middleware/multer/uploadMiddleware.js'

const router = express.Router();

router.post('/login', authUser)

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

router.get('/', protect, getUsers)

router.get('/:userId', getSingleUserById)
router.patch('/:userId', protect, updateUserById)
router.delete('/:userId', protect, deleteUserById)

export default router