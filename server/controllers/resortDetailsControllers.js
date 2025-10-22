import expressAsync from "express-async-handler";
import resortDetailsServices from "../services/resortDetailsServices.js";

const createResortDetails = expressAsync(async (req, res) => {
  try {
    const logo = req.files && req.files['logo'] ? req.files['logo'][0].path : "";
    const payload = { ...req.body };

    if (payload.socials && typeof payload.socials === 'string') {
      try {
        payload.socials = JSON.parse(payload.socials);
      } catch (parseError) {
        return res.status(400).json({ message: "Invalid socials format. Must be a valid JSON array." });
      }
    }

    if (logo) {
      if (!payload.companyInfo) {
        payload.companyInfo = {};
      }
      payload.companyInfo.logo = logo;
    }

    const response = await resortDetailsServices.createResortDetails(payload);
    res.status(201).json({ response, message: "Resort details successfully created." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

const getResortDetails = expressAsync(async (req, res) => {
  try {
    const response = await resortDetailsServices.getAllResortDetails(
      req.query
    );
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

const updateResortDetails = expressAsync(async (req, res) => {
  try {
    const logoFile = req.files && req.files['logo'] ? req.files['logo'][0] : null;
    const logo = logoFile ? logoFile.path : req.body.logo || "";

    const payload = {
      ...req.body,
      logo,
    };

    // Parse socials if it's a string
    if (payload.socials && typeof payload.socials === 'string') {
      try {
        payload.socials = JSON.parse(payload.socials);
      } catch (parseError) {
        return res.status(400).json({ message: "Invalid socials format. Must be a valid JSON array." });
      }
    }

    const response = await resortDetailsServices.updateResortDetails(payload);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});


export {
  createResortDetails,
  getResortDetails,
  updateResortDetails,
};