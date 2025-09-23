import TempBooking from '../models/tempBookingModels.js';

const createTempBooking = async (data) => {
  try {
    const tempBooking = await TempBooking.create(data);
    return tempBooking;
  } catch (error) {
    console.error("Error creating temporary booking:", error.message);
    throw new Error("Failed to create temporary booking");
  }
};

const getTempBookingByPaymentIntent = async (paymentIntentId) => {
  try {
    const tempBooking = await TempBooking.findOne({ paymentIntentId });
    return tempBooking;
  } catch (error) {
    console.error("Error fetching temporary booking:", error.message);
    throw new Error("Failed to fetch temporary booking");
  }
};

const deleteTempBooking = async (paymentIntentId) => {
  try {
    await TempBooking.deleteOne({ paymentIntentId });
    return true;
  } catch (error) {
    console.error("Error deleting temporary booking:", error.message);
    throw new Error("Failed to delete temporary booking");
  }
};

const cleanupExpiredBookings = async () => {
  try {
    const result = await TempBooking.deleteMany({
      expiresAt: { $lt: new Date() }
    });
    console.log(`Cleaned up ${result.deletedCount} expired bookings`);
    return result.deletedCount;
  } catch (error) {
    console.error("Error cleaning up expired bookings:", error.message);
  }
};

export default {
  createTempBooking,
  getTempBookingByPaymentIntent,
  deleteTempBooking,
  cleanupExpiredBookings
};