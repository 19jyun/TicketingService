import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/banners";

export const fetchBanners = async (
  username: string
): Promise<{ banners: string[] }> => {
  try {
    const response = await axios.get<{ banners: string[] }>(
      `${API_BASE_URL}?username=${username}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching banners:", error);
    throw error;
  }
};
