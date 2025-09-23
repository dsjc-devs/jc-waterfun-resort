import express from 'express';
import { handlePaymongoWebhook } from '../controllers/webhookControllers.js';

const router = express.Router();

router.post('/paymongo', express.raw({ type: 'application/json' }), handlePaymongoWebhook);

export default router;