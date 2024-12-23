import { Request, Response } from "express";
import fs from "fs";
import path from "path";

// File paths
const reservationsPath = path.resolve(
  __dirname,
  "../../data/reservations.json"
);
const showsPath = path.resolve(__dirname, "../../data/shows.json");

// Utility function to read JSON files
const readJSON = (filePath: string) => {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
};

// Utility function to write JSON files
const writeJSON = (filePath: string, data: any) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
};

// Add a reservation
export const addReservation = (req: Request, res: Response) => {
  try {
    const user_id = req.query.user_id as string;
    const show_id = parseInt(req.query.show_id as string);

    // seat_type과 seat_count를 배열로 처리
    const seat_types = Array.isArray(req.query.seat_type)
      ? (req.query.seat_type as string[])
      : [req.query.seat_type as string];
    const seat_counts = Array.isArray(req.query.seat_count)
      ? (req.query.seat_count as string[])
      : [req.query.seat_count as string];

    // 필수 값 검증
    if (!user_id || isNaN(show_id) || !seat_types || !seat_counts) {
      return res.status(400).json({
        message: "Invalid request. Missing or invalid query parameters.",
      });
    }

    // seat_types와 seat_counts의 길이 검증
    if (seat_types.length !== seat_counts.length) {
      return res.status(400).json({
        message: "Mismatch between seat types and seat counts.",
      });
    }

    // seat_counts를 숫자로 변환 후 필터링
    const filteredReservations = seat_types
      .map((seat_type, index) => ({
        seat_type,
        seat_count: parseInt(seat_counts[index]),
      }))
      .filter((item) => item.seat_count > 0); // 0 이하인 좌석은 제외

    if (filteredReservations.length === 0) {
      return res.status(400).json({
        message: "No valid reservations found. All seat counts are 0.",
      });
    }

    // 나머지 로직은 기존 코드와 동일
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

      // Update seat availability
      show.seats[seat_type] -= seat_count;

      // Generate reservation
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

    // Write updates to files
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

// Modify a reservation
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

    // Restore old seats
    show.seats[reservation.seat_type] += reservation.seat_count;

    // Check if new seats are available
    if (show.seats[new_seat_type] < new_seat_count) {
      return res.status(400).json({
        message: `Not enough seats available for ${new_seat_type}. Remaining: ${show.seats[new_seat_type]}`,
      });
    }

    // Update seats
    show.seats[new_seat_type] -= new_seat_count;

    // Update reservation
    reservation.seat_type = new_seat_type;
    reservation.seat_count = new_seat_count;
    reservation.price =
      parseFloat(show.price[new_seat_type].split(" ")[0]) * new_seat_count;

    // Write updates to files
    writeJSON(reservationsPath, reservations);
    writeJSON(showsPath, shows);

    return res
      .status(200)
      .json({ message: "Reservation successfully modified.", reservation });
  } catch (error) {
    return res.status(500);
  }
};

// Delete a reservation
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

    // Restore seats
    show.seats[reservation.seat_type] += reservation.seat_count;

    // Remove reservation
    reservations.splice(reservationIndex, 1);

    // Write updates to files
    writeJSON(reservationsPath, reservations);
    writeJSON(showsPath, shows);

    return res
      .status(200)
      .json({ message: "Reservation successfully deleted." });
  } catch (error) {
    return res.status(500);
  }
};

// Get reservation details
export const getReservation = (req: Request, res: Response) => {
  try {
    const user_id = req.query.user_id as string;

    // 유효성 검사
    if (!user_id) {
      return res
        .status(400)
        .json({ message: "Missing user_id in query parameters." });
    }

    // reservations.json 읽기
    const reservations = readJSON(reservationsPath);

    // user_id로 필터링
    const userReservations = reservations.filter(
      (reservation: any) => reservation.user_id === user_id
    );

    // 결과 반환
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
