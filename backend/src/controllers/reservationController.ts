import { Request, Response } from "express";
import fs from "fs";
import path from "path";

const reservationsPath = path.resolve(
  __dirname,
  "../../data/reservations.json"
);
const showsPath = path.resolve(__dirname, "../../data/shows.json");

const readJSON = (filePath: string) => {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
};

const writeJSON = (filePath: string, data: any) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
};

export const addReservation = (req: Request, res: Response) => {
  try {
    const user_id = req.query.user_id as string;
    const show_id = parseInt(req.query.show_id as string);

    const seat_types = Array.isArray(req.query.seat_type)
      ? (req.query.seat_type as string[])
      : [req.query.seat_type as string];
    const seat_counts = Array.isArray(req.query.seat_count)
      ? (req.query.seat_count as string[])
      : [req.query.seat_count as string];

    if (!user_id || isNaN(show_id) || !seat_types || !seat_counts) {
      return res.status(400).json({
        message: "Invalid request. Missing or invalid query parameters.",
      });
    }

    if (seat_types.length !== seat_counts.length) {
      return res.status(400).json({
        message: "Mismatch between seat types and seat counts.",
      });
    }

    const filteredReservations = seat_types
      .map((seat_type, index) => ({
        seat_type,
        seat_count: parseInt(seat_counts[index]),
      }))
      .filter((item) => item.seat_count > 0);

    if (filteredReservations.length === 0) {
      return res.status(400).json({
        message: "No valid reservations found. All seat counts are 0.",
      });
    }

    const shows = readJSON(showsPath);
    const reservations = readJSON(reservationsPath);

    const show = shows.find((s: any) => s.show_id === show_id);
    if (!show) {
      return res
        .status(404)
        .json({ message: `Show with ID ${show_id} not found.` });
    }

    const newReservations = [];
    for (const { seat_type, seat_count } of filteredReservations) {
      if (!seat_type || isNaN(seat_count)) {
        return res.status(400).json({
          message: "Invalid seat type or count.",
        });
      }

      if (show.seats[seat_type] < seat_count) {
        return res.status(400).json({
          message: `Not enough seats available for ${seat_type}. Remaining: ${show.seats[seat_type]}`,
        });
      }

      show.seats[seat_type] -= seat_count;

      const reservation_id = `${Math.random()
        .toString(36)
        .substr(2, 4)}-${Math.random()
        .toString(36)
        .substr(2, 4)}-${Math.random()
        .toString(36)
        .substr(2, 4)}-${Math.random().toString(36).substr(2, 4)}`;
      const newReservation = {
        reservation_id,
        user_id,
        show_id,
        date: new Date().toISOString(),
        seat_type,
        seat_count,
        price: parseFloat(show.price[seat_type].split(" ")[0]) * seat_count,
      };

      reservations.push(newReservation);
      newReservations.push(newReservation);
    }

    writeJSON(reservationsPath, reservations);
    writeJSON(showsPath, shows);

    return res.status(201).json({
      message: "Reservations successfully created.",
      reservations: newReservations,
    });
  } catch (error) {
    console.error("Error in addReservation:", error);
    return res.status(500).json({
      message: "An error occurred.",
    });
  }
};

export const modifyReservation = (req: Request, res: Response) => {
  try {
    const reservation_id = req.query.reservation_id as string;
    const new_seat_type = req.query.new_seat_type as string;
    const new_seat_count = parseInt(req.query.new_seat_count as string);

    if (!reservation_id || !new_seat_type || isNaN(new_seat_count)) {
      return res.status(400).json({
        message: "Invalid request. Missing or invalid query parameters.",
      });
    }

    const shows = readJSON(showsPath);
    const reservations = readJSON(reservationsPath);

    const reservation = reservations.find(
      (r: any) => r.reservation_id === reservation_id
    );
    if (!reservation) {
      return res
        .status(404)
        .json({ message: `Reservation with ID ${reservation_id} not found.` });
    }

    const show = shows.find((s: any) => s.show_id === reservation.show_id);
    if (!show) {
      return res
        .status(404)
        .json({ message: `Show with ID ${reservation.show_id} not found.` });
    }

    show.seats[reservation.seat_type] += reservation.seat_count;

    if (show.seats[new_seat_type] < new_seat_count) {
      return res.status(400).json({
        message: `Not enough seats available for ${new_seat_type}. Remaining: ${show.seats[new_seat_type]}`,
      });
    }

    show.seats[new_seat_type] -= new_seat_count;

    reservation.seat_type = new_seat_type;
    reservation.seat_count = new_seat_count;
    reservation.price =
      parseFloat(show.price[new_seat_type].split(" ")[0]) * new_seat_count;

    writeJSON(reservationsPath, reservations);
    writeJSON(showsPath, shows);

    return res
      .status(200)
      .json({ message: "Reservation successfully modified.", reservation });
  } catch (error) {
    return res.status(500);
  }
};

export const deleteReservation = (req: Request, res: Response) => {
  try {
    const reservation_id = req.query.reservation_id as string;

    if (!reservation_id) {
      return res
        .status(400)
        .json({ message: "Invalid request. Missing reservation_id." });
    }

    const shows = readJSON(showsPath);
    const reservations = readJSON(reservationsPath);

    const reservationIndex = reservations.findIndex(
      (r: any) => r.reservation_id === reservation_id
    );
    if (reservationIndex === -1) {
      return res
        .status(404)
        .json({ message: `Reservation with ID ${reservation_id} not found.` });
    }

    const reservation = reservations[reservationIndex];
    const show = shows.find((s: any) => s.show_id === reservation.show_id);
    if (!show) {
      return res
        .status(404)
        .json({ message: `Show with ID ${reservation.show_id} not found.` });
    }

    show.seats[reservation.seat_type] += reservation.seat_count;

    reservations.splice(reservationIndex, 1);

    writeJSON(reservationsPath, reservations);
    writeJSON(showsPath, shows);

    return res
      .status(200)
      .json({ message: "Reservation successfully deleted." });
  } catch (error) {
    return res.status(500);
  }
};

export const getReservation = (req: Request, res: Response) => {
  try {
    const user_id = req.query.user_id as string;

    if (!user_id) {
      return res
        .status(400)
        .json({ message: "Missing user_id in query parameters." });
    }

    const reservations = readJSON(reservationsPath);

    const userReservations = reservations.filter(
      (reservation: any) => reservation.user_id === user_id
    );

    if (userReservations.length === 0) {
      return res
        .status(404)
        .json({ message: `No reservations found for user_id: ${user_id}` });
    }

    return res.status(200).json({
      message: "Reservations retrieved successfully.",
      reservations: userReservations,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Failed to retrieve reservations.",
        error: error.message,
      });
    }
    return res.status(500).json({
      message: "Failed to retrieve reservations due to an unexpected error.",
    });
  }
};
