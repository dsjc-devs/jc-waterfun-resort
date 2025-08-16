import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createFaq,
  getAllFaqs,
  getSingleFaqById,
  updateFaqById,
  deleteFaqById,
  getPublishedFaqs,
} from "../controllers/faqsControllers.js";

const router = express.Router();

router.get('/published', getPublishedFaqs); 
router.post('/', protect, createFaq);
router.get('/', getAllFaqs);
router.get('/:faqId', getSingleFaqById);
router.patch('/:faqId', protect, updateFaqById);
router.delete('/:faqId', protect, deleteFaqById);

export default router;
