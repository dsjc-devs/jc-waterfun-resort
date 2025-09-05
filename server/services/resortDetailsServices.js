import ResortDetails from '../models/resortDetailsModels.js';

const createResortDetails = async (resortData) => {
  const { aboutUs, companyInfo, companyHashtag } = resortData || {};

  try {
    const existingResort = await ResortDetails.findOne();

    if (existingResort) {
      throw new Error("Resort details already exist. Use update instead.");
    }

    const payload = {};

    if (aboutUs) {
      payload.aboutUs = {};
      if (aboutUs.mission) payload.aboutUs.mission = aboutUs.mission;
      if (aboutUs.vision) payload.aboutUs.vision = aboutUs.vision;
      if (aboutUs.goals) payload.aboutUs.goals = aboutUs.goals;
    }

    if (companyInfo) {
      payload.companyInfo = {};
      if (companyInfo.logo) payload.companyInfo.logo = companyInfo.logo;
      if (companyInfo.name) payload.companyInfo.name = companyInfo.name;
      if (companyInfo.emailAddress) payload.companyInfo.emailAddress = companyInfo.emailAddress;

      if (companyInfo.phoneNumber && companyInfo.phoneNumber.trim()) {
        if (companyInfo.phoneNumber.length > 11) {
          throw new Error("Phone number cannot exceed 11 characters.");
        } else if (companyInfo.phoneNumber.length < 7) {
          throw new Error("Phone number must be at least 7 characters.");
        } else if (!/^\d+$/.test(companyInfo.phoneNumber)) {
          throw new Error("Phone number must contain only digits.");
        } else {
          payload.companyInfo.phoneNumber = companyInfo.phoneNumber;
        }
      }

      if (companyInfo.address) {
        payload.companyInfo.address = {};
        if (companyInfo.address.streetAddress) payload.companyInfo.address.streetAddress = companyInfo.address.streetAddress;
        if (companyInfo.address.city) payload.companyInfo.address.city = companyInfo.address.city;
        if (companyInfo.address.province) payload.companyInfo.address.province = companyInfo.address.province;
        if (companyInfo.address.country) payload.companyInfo.address.country = companyInfo.address.country;
      }
    }

    if (companyHashtag) {
      payload.companyHashtag = companyHashtag;
    }

    const resort = await ResortDetails.create(payload);

    return `Resort details with ID ${resort._id} successfully created.`;
  } catch (error) {
    console.error("Error creating resort details:", error.message);
    throw new Error(error);
  }
};

const getAllResortDetails = async () => {
  try {
    const resortDetails = ResortDetails.findOne({})
    return resortDetails
  } catch (error) {
    console.error("Error fetching resort details:", error.message);
    throw new Error(error);
  }
};

const updateResortDetails = async (updateData) => {
  try {
    if (typeof updateData.address === 'string') {
      updateData.address = JSON.parse(updateData.address);
    }

    const updatePayload = {
      'companyInfo.name': updateData.name,
      'companyInfo.emailAddress': updateData.emailAddress,
      'companyInfo.phoneNumber': updateData.phoneNumber,
      'companyInfo.logo': updateData.logo,
      'companyInfo.address.streetAddress': updateData.streetAddress ?? updateData.address?.streetAddress,
      'companyInfo.address.city': updateData.city ?? updateData.address?.city,
      'companyInfo.address.province': updateData.province ?? updateData.address?.province,
      'companyInfo.address.country': updateData.country ?? updateData.address?.country,

      'aboutUs.mission': updateData.mission,
      'aboutUs.vision': updateData.vision,
      'aboutUs.goals': updateData.goals,
      'companyHashtag': updateData.companyHashtag,
    };

    Object.keys(updatePayload).forEach(key => {
      if (updatePayload[key] === undefined) {
        delete updatePayload[key];
      }
    });

    const updatedResortDetails = await ResortDetails.findOneAndUpdate(
      {},
      { $set: updatePayload },
      { new: true, runValidators: true }
    );

    return {
      message: "Resort Details Successfully Updated",
      updatedResortDetails,
    };
  } catch (error) {
    console.error("Error updating resort details:", error.message);
    throw new Error(error);
  }
};

export default {
  createResortDetails,
  getAllResortDetails,
  updateResortDetails,
};
