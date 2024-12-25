import fs from "fs";
import path from "path";

const usersFile = path.join(__dirname, "../../data/users.json");
const showsFile = path.join(__dirname, "../../data/shows.json");

const readJsonFile = (filePath: string) => {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
};

const writeJsonFile = (filePath: string, data: any) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
};

export const BannerModel = {
  getAllUsers: () => {
    return readJsonFile(usersFile);
  },

  getUserByUsername: (username: string) => {
    const users = readJsonFile(usersFile);
    return users.find((user: any) => user.username === username) || null;
  },

  getAllShows: () => {
    return readJsonFile(showsFile);
  },

  getPostersByGenre: () => {
    const shows = readJsonFile(showsFile);
    const genreToPosters: Record<string, any[]> = {};

    shows.forEach((show: any) => {
      if (!genreToPosters[show.genre]) {
        genreToPosters[show.genre] = [];
      }
      genreToPosters[show.genre].push(show);
    });

    return genreToPosters;
  },

  selectPostersByInterest: (
    genreInterest: Record<string, number>,
    totalPosters: number
  ) => {
    const genreToPosters = BannerModel.getPostersByGenre();
    const selectedPosters: any[] = [];

    Object.entries(genreInterest).forEach(([genre, weight]) => {
      const posters = genreToPosters[genre] || [];
      const count = Math.round(totalPosters * weight);
      selectedPosters.push(...posters.slice(0, count));
    });

    return [...new Set(selectedPosters)].slice(0, totalPosters);
  },
};
