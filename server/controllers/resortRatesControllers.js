import expressAsync from "express-async-handler";
import resortRatesServices from "../services/resortRatesServices.js";

const getResortRates = expressAsync(async (req, res) => {
  try {
    const response = await resortRatesServices.getResortRates();
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

const updateResortRates = expressAsync(async (req, res) => {
  try {
    const response = await resortRatesServices.updateResortRates(req.body);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

export {
  getResortRates,
  updateResortRates
}