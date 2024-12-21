import { readJson, writeJson } from "fs-extra";
import path from "path";

const filePath = path.join(__dirname, "../../data/reservations.json");

export interface Reservation {
  reservation_id: number;
  user_id: string;
  show_id: number;
  seat: string;
  date: string;
}

export const getAllReservations = async (): Promise<Reservation[]> => {
  return await readJson(filePath);
};

export const createReservation = async (
  newReservation: Reservation
): Promise<void> => {
  const reservations = await getAllReservations();
  reservations.push(newReservation);
  await writeJson(filePath, reservations);
};
