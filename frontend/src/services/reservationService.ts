import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/reservations";

/**
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
        seat_type: seat_types,
        seat_count: seat_counts,
      },
      paramsSerializer: (params) => {
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
        new_seat_type: seatType,
        new_seat_count: seatCount,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error modifying reservation:", error);
    throw error.response?.data || error.message;
  }
};

/**
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
