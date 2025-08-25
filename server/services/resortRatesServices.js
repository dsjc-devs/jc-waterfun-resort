import ResortRates from "../models/resortRatesModels.js";

const getResortRates = async () => {
  try {
    const rates = await ResortRates.findOne();
    return rates;
  } catch (error) {
    throw new Error("Error fetching resort rates: " + error.message);
  }
};

const updateResortRates = async (payload) => {
  try {
    const updateData = {};

    if (payload?.entranceFee?.adult?.day !== undefined) {
      updateData["entranceFee.adult.day"] = payload.entranceFee.adult.day;
    }
    if (payload?.entranceFee?.adult?.night !== undefined) {
      updateData["entranceFee.adult.night"] = payload.entranceFee.adult.night;
    }
    if (payload?.entranceFee?.children?.day !== undefined) {
      updateData["entranceFee.children.night"] = payload.entranceFee.children.night;
    }

    const updated = await ResortRates.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return updated;
  } catch (error) {
    throw error;
  }
};


export default {
  getResortRates,
  updateResortRates,
};
