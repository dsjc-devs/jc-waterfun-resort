import ResortDetails from '../models/resortDetailsModels.js';

const createResortDetails = async (resortData) => {
  const { aboutUs, companyInfo } = resortData || {};

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

    const resort = await ResortDetails.create(payload);
    
    return `Resort details with ID ${resort._id} successfully created.`;
  } catch (error) {
    console.error("Error creating resort details:", error.message);
    throw new Error(error);
  }
};

const getAllResortDetails = async (queryObject) => {
  try {
    const page = parseInt(queryObject.page) || 1;
    const limit = parseInt(queryObject.limit) || 10;
    const skip = (page - 1) * limit;

    const { page: _page, limit: _limit, ...filters } = queryObject;

    const resorts = await ResortDetails.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await ResortDetails.countDocuments(filters);

    return {
      resorts,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalResorts: totalCount,
    };
  } catch (error) {
    console.error("Error fetching resort details:", error.message);
    throw new Error(error);
  }
};

const updateResortDetails = async (updateData) => {
  const { aboutUs, companyInfo } = updateData || {};

  try {
    const payload = {};

    if (aboutUs) {
      if (aboutUs.mission !== undefined) payload['aboutUs.mission'] = aboutUs.mission;
      if (aboutUs.vision !== undefined) payload['aboutUs.vision'] = aboutUs.vision;
      if (aboutUs.goals !== undefined) payload['aboutUs.goals'] = aboutUs.goals;
    }

    if (companyInfo) {
      if (companyInfo.logo !== undefined) payload['companyInfo.logo'] = companyInfo.logo;
      if (companyInfo.name !== undefined) payload['companyInfo.name'] = companyInfo.name;
      if (companyInfo.emailAddress !== undefined) payload['companyInfo.emailAddress'] = companyInfo.emailAddress;
      
      if (companyInfo.phoneNumber !== undefined) {
        if (companyInfo.phoneNumber && companyInfo.phoneNumber.trim()) {
          if (companyInfo.phoneNumber.length > 11) {
            throw new Error("Phone number cannot exceed 11 characters.");
          } else if (companyInfo.phoneNumber.length < 7) {
            throw new Error("Phone number must be at least 7 characters.");
          } else if (!/^\d+$/.test(companyInfo.phoneNumber)) {
            throw new Error("Phone number must contain only digits.");
          } else {
            payload['companyInfo.phoneNumber'] = companyInfo.phoneNumber;
          }
        } else {
          payload['companyInfo.phoneNumber'] = "";
        }
      }

      if (companyInfo.address) {
        if (companyInfo.address.streetAddress !== undefined) payload['companyInfo.address.streetAddress'] = companyInfo.address.streetAddress;
        if (companyInfo.address.city !== undefined) payload['companyInfo.address.city'] = companyInfo.address.city;
        if (companyInfo.address.province !== undefined) payload['companyInfo.address.province'] = companyInfo.address.province;
        if (companyInfo.address.country !== undefined) payload['companyInfo.address.country'] = companyInfo.address.country;
      }
    }

    // Find and update the single resort details document
    const resort = await ResortDetails.findOneAndUpdate(
      {}, // Empty filter to match any document (since there's only one)
      payload,
      { new: true, runValidators: true }
    );

    if (!resort) {
      throw new Error("Resort details not found");
    }

    return `Resort details successfully updated.`;
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
