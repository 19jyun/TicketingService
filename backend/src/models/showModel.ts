import { readJson } from "fs-extra";
import path from "path";

const filePath = path.join(__dirname, "../../data/shows.json");

export const getAllShows = async (): Promise<any[]> => {
  try {
    const shows = await readJson(filePath);
    return shows;
  } catch (error) {
    console.error("Error reading shows.json:", error);
    throw error;
  }
};

export const getShowById = async (id: number): Promise<any | null> => {
  try {
    const shows = await getAllShows();
    const show = shows.find((s) => s.show_id === id);
    return show || null;
  } catch (error) {
    console.error("Error fetching show by ID:", error);
    throw error;
  }
};
