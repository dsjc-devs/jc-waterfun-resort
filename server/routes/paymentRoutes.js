import express from 'express';
import { createPaymentIntent, payWithGCash } from '../controllers/paymentControllers.js';

const router = express.Router();

router.post('/pay-with-gcash', payWithGCash);

export default router;
