import fs from "fs";
import path from "path";

// JSON 파일 경로
const usersFile = path.join(__dirname, "../../data/users.json");
const showsFile = path.join(__dirname, "../../data/shows.json");

// JSON 파일 읽기
const readJsonFile = (filePath: string) => {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
};

// JSON 파일 쓰기
const writeJsonFile = (filePath: string, data: any) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
};

// User와 Show 데이터 접근
export const BannerModel = {
  // 모든 사용자 데이터 가져오기
  getAllUsers: () => {
    return readJsonFile(usersFile);
  },

  // 특정 사용자 가져오기
  getUserByUsername: (username: string) => {
    const users = readJsonFile(usersFile);
    return users.find((user: any) => user.username === username) || null;
  },

  // 모든 쇼 데이터 가져오기
  getAllShows: () => {
    return readJsonFile(showsFile);
  },

  // 장르별 쇼 매핑
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

  // 관심도 기반으로 포스터 선택
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

    // 중복 제거 및 최대 포스터 수 제한
    return [...new Set(selectedPosters)].slice(0, totalPosters);
  },
};
