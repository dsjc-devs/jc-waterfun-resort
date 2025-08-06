import { body, param } from 'express-validator';
import { validate } from '../../utils/expressValidator.js';
import { USER_TYPES } from '../../constants/constants.js'

const ALLOWED_POSITION_VALUES = USER_TYPES.map((item) => item.value)

const createValid = [
  body('firstName')
    .exists()
    .withMessage('firstName is required')
    .bail()
    .notEmpty()
    .withMessage('firstName must not be empty'),

  body('lastName')
    .exists()
    .withMessage('lastName is required')
    .bail()
    .notEmpty()
    .withMessage('lastName must not be empty'),

  body('emailAddress')
    .exists()
    .withMessage('emailAddress is required')
    .bail()
    .notEmpty()
    .withMessage('emailAddress must not be empty')
    .bail()
    .isEmail()
    .withMessage('emailAddress must be a valid email'),

  body('status')
    .exists()
    .withMessage('status is required')
    .bail()
    .notEmpty()
    .withMessage('status must not be empty'),

  body('password')
    .exists()
    .withMessage('password is required')
    .bail()
    .notEmpty()
    .withMessage('password must not be empty')
    .bail()
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 characters long'),

  body('position')
    .exists()
    .withMessage('position is required')
    .bail()
    .notEmpty()
    .withMessage('position must not be empty')
    .isIn(["RECEPTIONIST", "ADMIN", "MASTER_ADMIN", "CUSTOMER"])
    .withMessage(
      `position.value must be one of: ${["RECEPTIONIST", "ADMIN", "MASTER_ADMIN", "CUSTOMER"].join(", ")}`
    )

];

export const createValidator = [...createValid, validate];