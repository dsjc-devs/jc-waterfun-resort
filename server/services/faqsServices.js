import Faq from "../models/faqsModels.js";

const createFaq = async (faqData) => {
  const { title, answer, status } = faqData || {};

  try {
    if (!title || !answer || title.trim() === "" || answer.trim() === "") {
      throw new Error("Title and answer are required and cannot be empty");
    }

    const payload = {
      title,
      answer,
      status: status || "POSTED",
    };

    const faq = await Faq.create(payload);

    return {
      message: "FAQ created successfully",
      data: faq
    };
  } catch (error) {
    console.error("Error creating FAQ:", error.message);
    throw new Error(error);
  }
};

const getAllFaqs = async (queryObject) => {
  try {
    const page = parseInt(queryObject.page) || 1;
    const limit = parseInt(queryObject.limit) || 10;
    const skip = (page - 1) * limit;

    const { page: _page, limit: _limit, ...filters } = queryObject;

    const faqs = await Faq.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Faq.countDocuments(filters);

    return {
      faqs,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalFaqs: totalCount,
    };
  } catch (error) {
    console.error("Error fetching FAQs:", error.message);
    throw new Error(error);
  }
};

const getSingleFaqById = async (faqId) => {
  try {
    const faq = await Faq.findOne({ _id: faqId });

    if (!faq) {
      throw new Error("FAQ not found");
    }

    return faq;
  } catch (error) {
    console.error("Error fetching FAQ:", error.message);
    throw new Error(error);
  }
};

const updateFaqById = async (faqId, faqData) => {
  try {
    const { title, answer, status } = faqData || {};

    const existingFaq = await getSingleFaqById(faqId);

    const updateData = {};
    if (title !== undefined) {
      if (title.trim() === "") {
        throw new Error("Title cannot be empty");
      }
      updateData.title = title;
    }
    if (answer !== undefined) {
      if (answer.trim() === "") {
        throw new Error("Answer cannot be empty");
      }
      updateData.answer = answer;
    }
    if (status !== undefined) updateData.status = status;

    const updatedFaq = await Faq.findOneAndUpdate({ _id: faqId }, updateData, {
      new: true,
      runValidators: true,
    });

    return updatedFaq;
  } catch (error) {
    console.error("Error updating FAQ:", error.message);
    throw new Error(error);
  }
};

const deleteFaqById = async (faqId) => {
  try {
    const faq = await getSingleFaqById(faqId);
    const deletedFaq = await Faq.findOneAndDelete({ _id: faq._id });

    return `FAQ with ID ${deletedFaq._id} deleted successfully`;
  } catch (error) {
    console.error("Error deleting FAQ:", error.message);
    throw new Error("Failed to delete FAQ");
  }
};

export default {
  createFaq,
  getAllFaqs,
  getSingleFaqById,
  updateFaqById,
  deleteFaqById,
};
