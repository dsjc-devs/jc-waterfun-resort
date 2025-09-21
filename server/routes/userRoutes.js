import express from 'express';
import { createValidator } from '../middleware/validations/userValidator.js'
import {
  checkIfUserExists,
  protect,
  requirePermission,
  requireAnyPermission,
  canManageTargetUser,
  requireMasterAdminForAdminCreation,
  canChangeUserStatus,
  PERMISSIONS
} from '../middleware/authMiddleware.js'

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
  checkIfUserExists,
  requireAnyPermission([
    PERMISSIONS.CREATE_ADMIN,
    PERMISSIONS.CREATE_RECEPTIONIST,
    PERMISSIONS.CREATE_CUSTOMER
  ]),
  requireMasterAdminForAdminCreation,
  canManageTargetUser,
  createValidator,
  createUser
);

router.get('/',
  protect,
  getUsers
)

router.get('/:userId', protect, getSingleUserById)

router.patch('/:userId',
  protect,
  createUploadMiddleware({
    fields: [
      { name: 'avatar', maxCount: 1 },
    ],
    fieldFolders: {
      avatar: 'user_avatars',
    },
  }),
  canChangeUserStatus,
  updateUserById
);

router.delete('/:userId',
  protect,
  requireAnyPermission([
    PERMISSIONS.DELETE_ADMIN,
    PERMISSIONS.DELETE_RECEPTIONIST,
    PERMISSIONS.DELETE_CUSTOMER
  ]),
  deleteUserById
)

export default router