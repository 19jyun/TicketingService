import express from "express";
import {
  getReservations,
  addReservation,
} from "../controllers/reservationController";

const router = express.Router();

router.get("/", getReservations);
router.post("/", addReservation);

export default router;
