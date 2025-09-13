import cron from "node-cron";
import reservationServices from "../services/reservationServices.js";

export const startReservationCron = () => {
  cron.schedule("* * * * *", async () => {
    try {
      await reservationServices.checkAndUpdateReservationStatus();
    } catch (error) {
      console.error("Error running reservation status check:", error);
    }
  });
};
