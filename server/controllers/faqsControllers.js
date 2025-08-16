import expressAsync from "express-async-handler";
import faqsServices from "../services/faqsServices.js";

const createFaq = expressAsync(async (req, res) => {
  try {
    const response = await faqsServices.createFaq(req.body);
    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

const getAllFaqs = expressAsync(async (req, res) => {
  try {
    const response = await faqsServices.getAllFaqs(req.query);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

const getSingleFaqById = expressAsync(async (req, res) => {
  try {
    const response = await faqsServices.getSingleFaqById(req.params.faqId);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

const updateFaqById = expressAsync(async (req, res) => {
  try {
    const response = await faqsServices.updateFaqById(req.params.faqId, req.body);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

const deleteFaqById = expressAsync(async (req, res) => {
  try {
    const response = await faqsServices.deleteFaqById(req.params.faqId);
    res.json({ message: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

const getPublishedFaqs = expressAsync(async (req, res) => {
  try {
    const response = await faqsServices.getPublishedFaqs(req.query);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

export {
  createFaq,
  getAllFaqs,
  getSingleFaqById,
  updateFaqById,
  deleteFaqById,
  getPublishedFaqs,
};
