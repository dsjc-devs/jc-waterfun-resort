import BlockedDates from "../models/blockedDatesModel.js";
import Reservation from "../models/reservationsModels.js";

const createBlockedDate = async (data) => {
  try {
    const newBlockedDate = await BlockedDates.create(data);
    return newBlockedDate;
  } catch (error) {
    console.error("Error creating blocked date:", error);
    throw new Error("Could not create blocked date");
  }
}

const getAllBlockedDates = async () => {
  try {
    const manualBlocked = await BlockedDates.aggregate([
      {
        $project: {
          _id: 0,
          startDate: 1,
          endDate: 1,
          reason: 1,
          accommodationId: 1,
          blockType: 1,
          isFromReservation: { $literal: false }
        }
      }
    ]);

    const confirmedReservations = await Reservation.aggregate([
      {
        $match: { status: "CONFIRMED" }
      },
      {
        $lookup: {
          from: "accommodations",
          localField: "accommodationId",
          foreignField: "_id",
          as: "accommodation"
        }
      },
      {
        $unwind: "$accommodation"
      },
      {
        $project: {
          _id: 0,
          startDate: 1,
          endDate: 1,
          accommodationId: 1,
          reason: {
            $concat: [
              "Booked Reservation for ",
              "$accommodation.name"
            ]
          },
          isFromReservation: { $literal: true }
        }
      }
    ]);

    return [...manualBlocked, ...confirmedReservations];
  } catch (error) {
    console.error("Error fetching blocked dates:", error);
    throw new Error("Could not fetch blocked dates");
  }
};

const getBlockedDateById = async (id) => {
  try {
    const blockedDate = await BlockedDates.findById(id);
    return blockedDate;
  } catch (error) {
    console.error("Error fetching blocked date:", error);
    throw new Error("Could not fetch blocked date");
  }
}

const updateBlockedDate = async (id, data) => {
  try {
    const updatedBlockedDate = await BlockedDates.findByIdAndUpdate(id, data, { new: true });
    return updatedBlockedDate;
  } catch (error) {
    console.error("Error updating blocked date:", error);
    throw new Error("Could not update blocked date");
  }
}

const deleteBlockedDate = async (id) => {
  try {
    await BlockedDates.findByIdAndDelete(id);
    return { message: "Blocked date deleted" };
  } catch (error) {
    console.error("Error deleting blocked date:", error);
    throw new Error("Could not delete blocked date");
  }
}

export default {
  createBlockedDate,
  getAllBlockedDates,
  getBlockedDateById,
  updateBlockedDate,
  deleteBlockedDate
}