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

  body("position")
    .exists()
    .withMessage("position is required")
    .bail()
    .isArray({ min: 1 })
    .withMessage("position must be a non-empty array"),

  body("position.*.value")
    .exists()
    .withMessage("position.value is required")
    .bail()
    .isIn(ALLOWED_POSITION_VALUES)
    .withMessage(
      `position.value must be one of: ${ALLOWED_POSITION_VALUES.join(", ")}`
    ),

  body("position.*.label")
    .exists()
    .withMessage("position.label is required")
    .bail()
    .notEmpty()
    .withMessage("position.label must not be empty"),
];

export const createValidator = [...createValid, validate];