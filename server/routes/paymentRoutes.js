import express from 'express';
import { createPaymentIntent, payWithGCash, payWithMaya, payWithBankTransfer, payWithMethod, checkPaymentStatus } from '../controllers/paymentControllers.js';

const router = express.Router();

router.post('/pay-with-gcash', payWithGCash);
router.post('/pay-with-maya', payWithMaya);
router.post('/pay-with-bank-transfer', payWithBankTransfer);
router.post('/pay-with-method', payWithMethod);
router.post('/create-payment-with-booking', payWithMethod); // Alias for the new workflow
router.get('/status/:paymentIntentId', checkPaymentStatus);

export default router;
