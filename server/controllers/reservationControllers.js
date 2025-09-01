import expressAsync from "express-async-handler";
import reservationServices from "../services/reservationServices.js";

const createReservation = expressAsync(async (req, res) => {
  try {
    const reservationData = req.body
    const reservation = await reservationServices.createReservation(reservationData);

    res.status(201).json({
      success: true,
      message: "Reservation created successfully",
      reservation,
    });
  } catch (error) {
    console.error("Error in createReservation controller:", error);
    throw new Error(error);
  }
})

const getReservationsByQuery = expressAsync(async (req, res) => {
  try {
    const query = req.query || {};
    const data = await reservationServices.getReservationsByQuery(query);

    const transformedReservations = data?.reservations.map((reservation) => {
      const { accommodationId, ...rest } = reservation.toObject
        ? reservation.toObject()
        : reservation;
      return {
        ...rest,
        accommodationData: accommodationId,
      };
    });

    const transformed = {
      ...data,
      reservations: transformedReservations,
    };

    res.status(200).json(transformed);
  } catch (error) {
    console.error("Error in getReservationsByQuery controller:", error);
    throw new Error(error);
  }
});

const getSingleReservationById = expressAsync(async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await reservationServices.getSingleReservationById(id)
    res.status(200).json(reservation);
  } catch (error) {
    console.error("Error in getSingleReservationById controller:", error);
    throw new Error(error);
  }
})

const updateReservationById = expressAsync(async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body
    const updatedReservation = await reservationServices.updateReservationById(id, updateData);

    res.status(200).json({
      success: true,
      message: "Reservation updated successfully",
      updatedReservation,
    });
  } catch (error) {
    console.error("Error in updateReservationById controller:", error);
    throw new Error(error);
  }
})

const deleteReservationById = expressAsync(async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReservation = await reservationServices.deleteReservationById(id);
    res.status(200).json({
      success: true,
      message: "Reservation deleted successfully",
      deletedReservation,
    });
  } catch (error) {
    console.error("Error in deleteReservationById controller:", error);
    throw new Error(error);
  }
})

export {
  createReservation,
  getReservationsByQuery,
  getSingleReservationById,
  updateReservationById,
  deleteReservationById
}