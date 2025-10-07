import { body } from 'express-validator';
import { validate } from '../../utils/expressValidator.js';

const changePasswordValid = [
  body('emailAddress')
    .isEmail()
    .withMessage('Valid email address is required.'),
  body('oldPassword')
    .isString()
    .notEmpty()
    .withMessage('Old password is required.'),
  body('newPassword')
    .isString()
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long.')
];

export const changePasswordValidator = [...changePasswordValid, validate];
