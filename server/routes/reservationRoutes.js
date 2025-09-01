import {
  createReservation,
  getReservationsByQuery,
  getSingleReservationById,
  updateReservationById,
  deleteReservationById
} from '../controllers/reservationControllers.js';
import { createReservationValidator } from '../middleware/validations/reservationValidator.js';

import express from 'express';

const router = express.Router();

router.post('/', createReservationValidator, createReservation);
router.get('/', getReservationsByQuery);
router.get('/:id', getSingleReservationById);
router.patch('/:id', updateReservationById);
router.delete('/:id', deleteReservationById);

export default router;