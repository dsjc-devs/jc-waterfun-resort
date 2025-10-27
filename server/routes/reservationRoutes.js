import {
  createReservation,
  getReservationsByQuery,
  getSingleReservationById,
  updateReservationById,
  deleteReservationById,
  requestReschedule,
  decideReschedule
} from '../controllers/reservationControllers.js';
import { createReservationValidator } from '../middleware/validations/reservationValidator.js';
import { protect } from '../middleware/authMiddleware.js'

import express from 'express';

const router = express.Router();

router.post('/', protect, createReservationValidator, createReservation);
router.get('/', protect, getReservationsByQuery);
router.get('/:id', protect, getSingleReservationById);
router.patch('/:id', protect, updateReservationById);
router.delete('/:id', protect, deleteReservationById);

// Reschedule routes
router.post('/:id/reschedule', protect, requestReschedule);
router.patch('/:id/reschedule', protect, decideReschedule);

export default router;