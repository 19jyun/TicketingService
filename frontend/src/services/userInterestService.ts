import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

/**
 * @param username
 * @param genre
 * @param action
 * @returns
 */
export const updateInterest = async (
  username: string,
  genre: string,
  action: "search" | "reservation"
): Promise<{
  success: boolean;
  message: string;
  interest?: Record<string, number>;
}> => {
  try {
    const response = await axios.post(`${BASE_URL}/users/interest`, null, {
      params: {
        username,
        genre,
        action,
      },
    });

    console.log(`Successfully updated interest for user: ${username}`);
    return response.data;
  } catch (error: any) {
    console.error("Error updating interest:", error);
    return {
      success: false,
      message: error.response?.data?.error || "An unknown error occurred.",
    };
  }
};
