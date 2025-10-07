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

    if (payload?.entranceFee?.child?.day !== undefined) {
      updateData["entranceFee.child.day"] = payload.entranceFee.child.day;
    }
    if (payload?.entranceFee?.child?.night !== undefined) {
      updateData["entranceFee.child.night"] = payload.entranceFee.child.night;
    }

    if (payload?.entranceFee?.pwdSenior?.day !== undefined) {
      updateData["entranceFee.pwdSenior.day"] = payload.entranceFee.pwdSenior.day;
    }
    if (payload?.entranceFee?.pwdSenior?.night !== undefined) {
      updateData["entranceFee.pwdSenior.night"] = payload.entranceFee.pwdSenior.night;
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
