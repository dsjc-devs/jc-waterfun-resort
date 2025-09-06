import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createPolicy,
  getAllPolicies,
  getSinglePolicyById,
  updatePolicyById,
  deletePolicyById,
} from "../controllers/policiesControllers.js";

const router = express.Router();

router.post('/', protect, createPolicy);
router.get('/', getAllPolicies);
router.get('/:policyId', getSinglePolicyById);
router.patch('/:policyId', protect, updatePolicyById);
router.delete('/:policyId', protect, deletePolicyById);

export default router;
