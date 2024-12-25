import express from "express";
import {
  addReservation,
  modifyReservation,
  deleteReservation,
  getReservation,
} from "../controllers/reservationController";

const router = express.Router();

router.get("/add", addReservation);

router.get("/modify", modifyReservation);

router.get("/delete", deleteReservation);

router.get("/get", getReservation);

export default router;
