import expressAsync from "express-async-handler";
import announcementsServices from "../services/announcementsServices.js";

const createAnnouncement = expressAsync(async (req, res) => {
  try {
    const response = await announcementsServices.createAnnouncement(req.body, req.files);
    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

const getAllAnnouncements = expressAsync(async (req, res) => {
  try {
    const response = await announcementsServices.getAllAnnouncements(req.query);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

const getSingleAnnouncementById = expressAsync(async (req, res) => {
  try {
    const response = await announcementsServices.getSingleAnnouncementById(req.params.announcementId);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

const updateAnnouncementById = expressAsync(async (req, res) => {
  try {
    const response = await announcementsServices.updateAnnouncementById(req.params.announcementId, req.body, req.files);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

const deleteAnnouncementById = expressAsync(async (req, res) => {
  try {
    const response = await announcementsServices.deleteAnnouncementById(req.params.announcementId);
    res.json({ message: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

export {
  createAnnouncement,
  getAllAnnouncements,
  getSingleAnnouncementById,
  updateAnnouncementById,
  deleteAnnouncementById,
};
