import Announcement from "../models/announcementsModels.js";

const createAnnouncement = async (announcementData, files = {}) => {
  const { title, description } = announcementData || {};

  try {
    if (!title || !description || title.trim() === "") {
      throw new Error("Title and description are required and cannot be empty");
    }

    if (!description.short || !description.long || description.short.trim() === "" || description.long.trim() === "") {
      throw new Error("Both short and long descriptions are required and cannot be empty");
    }

    // Process uploaded file (single file)
    let attachments = null;
    if (files.attachments && files.attachments.length > 0) {
      attachments = files.attachments[0].path;
    }

    const payload = {
      title,
      description: {
        short: description.short,
        long: description.long
      },
      attachments: attachments,
    };

    const announcement = await Announcement.create(payload);

    return {
      message: "Announcement created successfully",
      data: announcement
    };
  } catch (error) {
    console.error("Error creating announcement:", error.message);
    throw new Error(error);
  }
};

const getAllAnnouncements = async (queryObject) => {
  try {
    const page = parseInt(queryObject.page) || 1;
    const limit = parseInt(queryObject.limit) || 10;
    const skip = (page - 1) * limit;

    const { page: _page, limit: _limit, ...filters } = queryObject;

    const announcements = await Announcement.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Announcement.countDocuments(filters);

    return {
      announcements,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalAnnouncements: totalCount,
    };
  } catch (error) {
    console.error("Error fetching announcements:", error.message);
    throw new Error(error);
  }
};

const getSingleAnnouncementById = async (announcementId) => {
  try {
    const announcement = await Announcement.findOne({ _id: announcementId });

    if (!announcement) {
      throw new Error("Announcement not found");
    }

    return announcement;
  } catch (error) {
    console.error("Error fetching announcement:", error.message);
    throw new Error(error);
  }
};

const updateAnnouncementById = async (announcementId, announcementData, files = {}) => {
  try {
    const { title, description } = announcementData || {};

    const existingAnnouncement = await getSingleAnnouncementById(announcementId);

    const updateData = {};
    
    if (title !== undefined) {
      if (title.trim() === "") {
        throw new Error("Title cannot be empty");
      }
      updateData.title = title;
    }
    
    if (description !== undefined) {
      if (description.short !== undefined) {
        if (description.short.trim() === "") {
          throw new Error("Short description cannot be empty");
        }
        updateData["description.short"] = description.short;
      }
      if (description.long !== undefined) {
        if (description.long.trim() === "") {
          throw new Error("Long description cannot be empty");
        }
        updateData["description.long"] = description.long;
      }
    }
    
    // Process uploaded file (single file)
    if (files.attachments && files.attachments.length > 0) {
      updateData.attachments = files.attachments[0].path;
    }

    const updatedAnnouncement = await Announcement.findOneAndUpdate(
      { _id: announcementId }, 
      updateData, 
      {
        new: true,
        runValidators: true,
      }
    );

    return updatedAnnouncement;
  } catch (error) {
    console.error("Error updating announcement:", error.message);
    throw new Error(error);
  }
};

const deleteAnnouncementById = async (announcementId) => {
  try {
    const announcement = await getSingleAnnouncementById(announcementId);
    const deletedAnnouncement = await Announcement.findOneAndDelete({ _id: announcement._id });

    return `Announcement with ID ${deletedAnnouncement._id} deleted successfully`;
  } catch (error) {
    console.error("Error deleting announcement:", error.message);
    throw new Error("Failed to delete announcement");
  }
};

export default {
  createAnnouncement,
  getAllAnnouncements,
  getSingleAnnouncementById,
  updateAnnouncementById,
  deleteAnnouncementById,
};
