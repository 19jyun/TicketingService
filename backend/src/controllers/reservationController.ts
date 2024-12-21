import { Request, Response } from "express";
import {
  getAllReservations,
  createReservation,
} from "../models/reservationModel";

export const getReservations = async (req: Request, res: Response) => {
  const reservations = await getAllReservations();
  res.json(reservations);
};

export const addReservation = async (req: Request, res: Response) => {
  const newReservation = req.body;
  await createReservation(newReservation);
  res.status(201).json({ message: "Reservation created successfully" });
};
