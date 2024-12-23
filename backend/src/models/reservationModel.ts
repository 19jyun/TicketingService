import fs from "fs";
import path from "path";

// JSON 파일 경로
const reservationsFile = path.join(__dirname, "../../data/reservations.json");
const showsFile = path.join(__dirname, "../../data/shows.json");

// JSON 파일 읽기
const readJsonFile = (filePath: string) => {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
};

// JSON 파일 쓰기
const writeJsonFile = (filePath: string, data: any) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
};

// Reservation 데이터 접근
export const ReservationModel = {
  getAllReservations: () => {
    return readJsonFile(reservationsFile);
  },

  addReservation: (reservation: any) => {
    const reservations = readJsonFile(reservationsFile);
    reservations.push(reservation);
    writeJsonFile(reservationsFile, reservations);
  },

  updateReservation: (reservationId: string, updatedReservation: any) => {
    const reservations = readJsonFile(reservationsFile);
    const index = reservations.findIndex(
      (r: any) => r.reservation_id === reservationId
    );
    if (index === -1) throw new Error("Reservation not found.");
    reservations[index] = updatedReservation;
    writeJsonFile(reservationsFile, reservations);
  },

  deleteReservation: (reservationId: string) => {
    const reservations = readJsonFile(reservationsFile);
    const updatedReservations = reservations.filter(
      (r: any) => r.reservation_id !== reservationId
    );
    writeJsonFile(reservationsFile, updatedReservations);
  },
};

// Show 데이터 접근
export const ShowModel = {
  getAllShows: () => {
    return readJsonFile(showsFile);
  },

  updateShow: (showId: string, updatedShow: any) => {
    const shows = readJsonFile(showsFile);
    const index = shows.findIndex((s: any) => s.show_id === showId);
    if (index === -1) throw new Error("Show not found.");
    shows[index] = updatedShow;
    writeJsonFile(showsFile, shows);
  },
};
