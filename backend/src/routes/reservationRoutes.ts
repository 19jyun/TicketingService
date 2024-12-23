import express from "express";
import {
  addReservation,
  modifyReservation,
  deleteReservation,
  getReservation,
} from "../controllers/reservationController";

const router = express.Router();

// Add a reservation (using GET with query params)
router.get("/add", addReservation);

// Modify a reservation (using GET with query params)
router.get("/modify", modifyReservation);

// Delete a reservation (using GET with query params)
router.get("/delete", deleteReservation);

// Get reservation details (using GET with query params)
router.get("/get", getReservation);

export default router;
