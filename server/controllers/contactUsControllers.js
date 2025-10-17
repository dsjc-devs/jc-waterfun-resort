import expressAsync from "express-async-handler";
import contactUsServices from "../services/contactUsServices.js";

const createContact = expressAsync(async (req, res) => {
  try {
    const response = await contactUsServices.createContact(req.body);
    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    const isCaptchaError = error?.message?.toLowerCase()?.includes('captcha');
    res.status(isCaptchaError ? 400 : 500).json({ message: error.message });
  }
});

const getAllContacts = expressAsync(async (req, res) => {
  try {
    const response = await contactUsServices.getAllContacts(req.query);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

const getSingleContactById = expressAsync(async (req, res) => {
  try {
    const response = await contactUsServices.getSingleContactById(req.params.contactId);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});


export {
  createContact,
  getAllContacts,
  getSingleContactById,
}