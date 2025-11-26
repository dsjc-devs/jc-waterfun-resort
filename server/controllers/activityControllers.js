import expressAsync from "express-async-handler";
import activityServices from "../services/activityServices.js";

const createActivity = expressAsync(async (req, res) => {
  try {
    const activity = await activityServices.createActivity(req.body || {});
    res.status(201).json({
      success: true,
      message: "Activity created successfully",
      activity,
    });
  } catch (error) {
    console.error("Error in createActivity controller:", error);
    throw new Error(error);
  }
});

const getActivities = expressAsync(async (req, res) => {
  try {
    const reservationId = req.query?.reservationId || '';
    const activities = await activityServices.getActivities({ reservationId });
    res.status(200).json(activities);
  } catch (error) {
    console.error("Error in getActivities controller:", error);
    throw new Error(error);
  }
});

export { createActivity, getActivities };
