import ContactUs from '../models/contactUsModels.js';

const createContact = async (contactData) => {
  const { firstName, lastName, emailAddress, phoneNumber, subject, remarks } = contactData || {};

  try {
    // Build payload conditionally
    const payload = {
      firstName,
      lastName,
      emailAddress,
      subject,
      remarks
    };

    // Only add phoneNumber if it exists and is not empty
    if (phoneNumber && phoneNumber.trim()) {
        if (phoneNumber.length > 11) {
            throw new Error("Phone number cannot exceed 11 characters.");
        }else if (phoneNumber.length < 11) {
            throw new Error("Phone number must be at least 7 characters.");
        }
        else if (!/^\d+$/.test(phoneNumber)) {
            throw new Error("Phone number must contain only digits.");
        }
        else{
            payload.phoneNumber = phoneNumber;
        }
    }

    const contact = await ContactUs.create(payload);

    return `Contact message with ID ${contact._id} successfully created.`;
  } catch (error) {
    console.error("Error creating contact message:", error.message);
    throw new Error(error);
  }
}

const getAllContacts = async (queryObject) => {
  try {
    const page = parseInt(queryObject.page) || 1;
    const limit = parseInt(queryObject.limit) || 10;
    const skip = (page - 1) * limit;

    const { page: _page, limit: _limit, ...filters } = queryObject;

    const contacts = await ContactUs.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await ContactUs.countDocuments(filters);

    return {
      contacts,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalContacts: totalCount,
    };
  } catch (error) {
    console.error("Error fetching contacts:", error.message);
    throw new Error(error);
  }
}

const getSingleContactById = async (contactId) => {
  try {
    const contact = await ContactUs.findOne({ _id: contactId });

    if (!contact) {
      throw new Error("Contact message not found");
    }

    return contact;
  } catch (error) {
    console.error("Error fetching contact message:", error.message);
    throw new Error(error);
  }
}


export default {
  createContact,
  getAllContacts,
  getSingleContactById,
};