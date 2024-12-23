import axios from "axios";

// Base URL for API
const API_BASE_URL = "http://localhost:5000/api/reservations";

/**
 * Add a new reservation
 * @param userId User ID
 * @param showId Show ID
 * @param seatType Seat type ('regular' or 'vip')
 * @param seatCount Number of seats
 * @returns Response data
 */
export const addReservation = async (
  user_id: string,
  show_id: number,
  seat_types: string[],
  seat_counts: number[]
) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/add`, {
      params: {
        user_id,
        show_id,
        seat_type: seat_types, // 배열 전달
        seat_count: seat_counts, // 배열 전달
      },
      paramsSerializer: (params) => {
        // 배열 직렬화를 올바르게 처리
        return Object.keys(params)
          .map((key) =>
            Array.isArray(params[key])
              ? (params[key] as string[])
                  .map((val) => `${key}=${encodeURIComponent(val)}`)
                  .join("&")
              : `${key}=${encodeURIComponent(params[key] as string)}`
          )
          .join("&");
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in addReservation:", error);
    throw error;
  }
};

/**
 * Modify an existing reservation
 * @param reservationId Reservation ID
 * @param seatType New seat type ('regular' or 'vip')
 * @param seatCount New seat count
 * @returns Response data
 */
export const modifyReservation = async (
  reservationId: string,
  seatType: "regular" | "vip",
  seatCount: number
) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/modify`, {
      params: {
        reservation_id: reservationId,
        seat_type: seatType,
        seat_count: seatCount,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error modifying reservation:", error);
    throw error.response?.data || error.message;
  }
};

/**
 * Delete a reservation
 * @param reservationId Reservation ID
 * @returns Response data
 */
export const deleteReservation = async (reservationId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/delete`, {
      params: {
        reservation_id: reservationId,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error deleting reservation:", error);
    throw error.response?.data || error.message;
  }
};

/**
 * Get reservations for a specific user
 * @param userId User ID
 * @returns List of reservations
 */
export const getReservations = async (userId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get`, {
      params: {
        user_id: userId,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error getting reservations:", error);
    throw error.response?.data || error.message;
  }
};
