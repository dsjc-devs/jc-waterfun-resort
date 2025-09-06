import expressAsync from "express-async-handler";
import policiesServices from "../services/policiesServices.js";

const createPolicy = expressAsync(async (req, res) => {
  try {
    const response = await policiesServices.createPolicy(req.body);
    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

const getAllPolicies = expressAsync(async (req, res) => {
  try {
    const response = await policiesServices.getAllPolicies(req.query);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

const getSinglePolicyById = expressAsync(async (req, res) => {
  try {
    const response = await policiesServices.getSinglePolicyById(req.params.policyId);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});



const updatePolicyById = expressAsync(async (req, res) => {
  try {
    const response = await policiesServices.updatePolicyById(req.params.policyId, req.body);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

const deletePolicyById = expressAsync(async (req, res) => {
  try {
    const response = await policiesServices.deletePolicyById(req.params.policyId);
    res.json({ message: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

export {
  createPolicy,
  getAllPolicies,
  getSinglePolicyById,
  updatePolicyById,
  deletePolicyById,
};
