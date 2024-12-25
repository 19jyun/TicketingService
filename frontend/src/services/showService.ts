import axios from "axios";
import { Show } from "../types/Show";

const API_BASE_URL = "http://localhost:5000/api/shows";

export const searchShows = async (keyword: string): Promise<Show[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: { keyword },
    });
    return response.data.shows;
  } catch (error) {
    console.error("Error searching shows:", error);
    return [];
  }
};

export const getShowById = async (
  show_id: number | string
): Promise<Show | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${show_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching show details:", error);
    return null;
  }
};

export const fetchAllGenresTopShows = async (): Promise<
  { genre: string; topShows: Show[] }[]
> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/top-shows`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all genres top shows:", error);
    return [];
  }
};
