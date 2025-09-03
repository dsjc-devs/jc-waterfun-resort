import expressAsync from "express-async-handler";
import blockedDatesServices from "../services/blockedDatesServices.js";

const createBlockedDate = expressAsync(async (req, res) => {
  try {
    const newBlockedDate = await blockedDatesServices.createBlockedDate(req.body);
    res.status(201).json(newBlockedDate);
  } catch (error) {
    console.error("Error in createBlockedDate controller:", error);
    throw new Error("Could not create blocked date");
  }
});

const getAllBlockedDates = expressAsync(async (req, res) => {
  try {
    const blockedDates = await blockedDatesServices.getAllBlockedDates(req.query);
    res.status(200).json(blockedDates);
  } catch (error) {
    console.error("Error in getAllBlockedDates controller:", error);
    throw new Error("Could not fetch blocked dates");
  }
});

const getBlockedDateById = expressAsync(async (req, res) => {
  try {
    const blockedDate = await blockedDatesServices.getBlockedDateById(req.params.id);
    if (!blockedDate) {
      res.status(404).json({ message: "Blocked date not found" });
      return;
    }
    res.status(200).json(blockedDate);
  } catch (error) {
    console.error("Error in .getBlockedDateById controller:", error);
    throw new Error("Could not fetch blocked date");
  }
});

const updateBlockedDate = expressAsync(async (req, res) => {
  try {
    const updatedBlockedDate = await blockedDatesServices.updateBlockedDate(req.params.id, req.body);
    if (!updatedBlockedDate) {
      res.status(404).json({ message: "Blocked date not found" });
      return;
    }
    res.status(200).json(updatedBlockedDate);
  } catch (error) {
    console.error("Error in updateBlockedDate controller:", error);
    throw new Error("Could not update blocked date");
  }
});

const deleteBlockedDate = expressAsync(async (req, res) => {
  try {
    const deleted = await blockedDatesServices.deleteBlockedDate(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: "Blocked date not found" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error in deleteBlockedDate controller:", error);
    throw new Error("Could not delete blocked date");
  }
});

export {
  createBlockedDate,
  getAllBlockedDates,
  getBlockedDateById,
  updateBlockedDate,
  deleteBlockedDate,
};