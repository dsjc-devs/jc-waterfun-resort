import ContactUs from '../models/contactUsModels.js';
import ResortDetails from '../models/resortDetailsModels.js';
import sendEmail from '../utils/sendNodeMail.js';
import emailTemplate from '../templates/defaults/index.js';
import {
  contactAcknowledgementTemplate,
  contactNotificationTemplate
} from '../templates/contact-us.js';
import verifyRecaptcha from '../utils/verifyRecaptcha.js';

const sanitizePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return undefined;

  const trimmed = phoneNumber.trim();
  if (!trimmed) return undefined;

  const digitsOnly = trimmed.replace(/[^0-9]/g, '');

  if (digitsOnly.length > 11) {
    throw new Error('Phone number cannot exceed 11 digits.');
  }

  if (digitsOnly.length < 7) {
    throw new Error('Phone number must include at least 7 digits.');
  }

  return digitsOnly;
};

const getNotificationRecipient = async () => {
  const resortDetails = await ResortDetails.findOne();
  return resortDetails?.companyInfo?.emailAddress
    || process.env.CONTACT_NOTIFICATION_EMAIL
    || process.env.MAIL_CONFIGS_EMAIL;
};

const dispatchContactEmails = async (payload) => {
  try {
    // const notificationRecipient = await getNotificationRecipient();
    const notificationRecipient = `johncezar.waterfun.mail@gmail.com`

    if (notificationRecipient) {
      const adminBody = contactNotificationTemplate(payload);
      const adminEmailContent = await emailTemplate(adminBody);
      const subject = `New Inquiry: ${payload.subject || 'Contact Us Message'}`;
      await sendEmail(notificationRecipient, subject, adminEmailContent);
    }

    if (payload.emailAddress) {
      const guestBody = contactAcknowledgementTemplate(payload);
      const guestEmailContent = await emailTemplate(guestBody);
      await sendEmail(payload.emailAddress, 'We received your inquiry', guestEmailContent);
    }
  } catch (error) {
    console.error('Error sending contact emails:', error?.message || error);
  }
};

const createContact = async (contactData) => {
  const {
    recaptchaToken,
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
    subject,
    remarks
  } = contactData || {};

  try {
    await verifyRecaptcha(recaptchaToken);

    const sanitizedPhone = sanitizePhoneNumber(phoneNumber);

    const payload = {
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      emailAddress: emailAddress?.trim(),
      subject: subject?.trim(),
      remarks: remarks?.trim()
    };

    if (sanitizedPhone) {
      payload.phoneNumber = sanitizedPhone;
    }

    const contact = await ContactUs.create(payload);

    await dispatchContactEmails(payload);

    return `Contact message with ID ${contact._id} successfully created.`;
  } catch (error) {
    console.error('Error creating contact message:', error?.message || error);
    throw new Error(error?.message || 'Failed to create contact message.');
  }
};

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