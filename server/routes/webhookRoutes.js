import express from 'express';
import { handlePaymongoWebhook } from '../controllers/webhookControllers.js';

const router = express.Router();
router.post('/paymongo', express.json({ type: 'application/json' }), handlePaymongoWebhook);

export default router;