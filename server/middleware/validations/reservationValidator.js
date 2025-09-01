import { body } from "express-validator";
import { validate } from "../../utils/expressValidator.js";

const createReservationValid = [
  body("userId")
    .notEmpty()
    .withMessage("userId is required"),

  body("accommodationId")
    .notEmpty()
    .withMessage("accommodationId is required"),

  body("startDate")
    .notEmpty()
    .withMessage("startDate is required")
    .isISO8601()
    .withMessage("startDate must be a valid date"),

  body("endDate")
    .notEmpty()
    .withMessage("endDate is required")
    .isISO8601()
    .withMessage("endDate must be a valid date"),

  body("status")
    .optional()
    .isIn(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "RESCHEDULED", "ARCHIVED"])
    .withMessage("Invalid status value"),

  body("amount.accommodationTotal")
    .notEmpty()
    .withMessage("amount.accommodationTotal is required")
    .isNumeric(),

  body("amount.entranceTotal")
    .notEmpty()
    .withMessage("amount.entranceTotal is required")
    .isNumeric(),

  body("amount.total")
    .notEmpty()
    .withMessage("amount.total is required")
    .isNumeric(),

  body("amount.minimumPayable")
    .notEmpty()
    .withMessage("amount.minimumPayable is required")
    .isNumeric(),

  body("amount.totalPaid")
    .notEmpty()
    .withMessage("amount.totalPaid is required")
    .isNumeric(),
];

export const createReservationValidator = [...createReservationValid, validate];
