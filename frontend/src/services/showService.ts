import axios from "axios";
import { Show } from "../types/Show";

const API_BASE_URL = "http://localhost:5000/api/shows";

export const searchShows = async (keyword: string): Promise<Show[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: { keyword },
    });
    return response.data.shows; // API 응답에서 쇼 데이터만 반환
  } catch (error) {
    console.error("Error searching shows:", error);
    return []; // 에러 발생 시 빈 배열 반환
  }
};

export const getShowById = async (
  show_id: number | string
): Promise<Show | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${show_id}`); // API 호출
    return response.data; // 쇼 데이터 반환
  } catch (error) {
    console.error("Error fetching show details:", error);
    return null; // 에러 발생 시 null 반환
  }
};

export const fetchAllGenresTopShows = async (): Promise<
  { genre: string; topShows: Show[] }[]
> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/top-shows`);
    return response.data; // 백엔드에서 각 장르별 데이터 반환
  } catch (error) {
    console.error("Error fetching all genres top shows:", error);
    return [];
  }
};
