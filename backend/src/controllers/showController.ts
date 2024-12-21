import { Request, Response } from "express";
import { getAllShows, getShowById } from "../models/showModel";

// 모든 쇼 데이터를 반환
export const getShows = async (req: Request, res: Response) => {
  try {
    const shows = await getAllShows(); // 모든 쇼 데이터를 가져옴
    res.status(200).json(shows);
  } catch (error) {
    console.error("Error fetching shows:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 특정 쇼 데이터를 반환
export const getShow = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid show ID" });
    }

    const show = await getShowById(id);

    if (show) {
      res.status(200).json(show);
    } else {
      res.status(404).json({ error: "Show not found" });
    }
  } catch (error) {
    console.error("Error fetching show by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 검색된 쇼 데이터를 반환
export const searchShows = async (req: Request, res: Response) => {
  try {
    const keyword = req.query.keyword
      ? String(req.query.keyword).toLowerCase()
      : ""; // 쿼리에서 검색어 가져오기

    const shows = await getAllShows(); // 모든 쇼 데이터 가져오기

    // 검색어가 없는 경우 모든 쇼 반환
    if (!keyword) {
      return res.status(200).json({ success: true, shows });
    }

    // 검색어로 필터링
    const filteredShows = shows.filter((show) => {
      const titleMatch = show.title.toLowerCase().includes(keyword);
      const genreMatch = show.genre.toLowerCase().includes(keyword);
      const descriptionMatch = show.description.toLowerCase().includes(keyword);
      return titleMatch || genreMatch || descriptionMatch;
    });

    res.status(200).json({ success: true, shows: filteredShows });
  } catch (error) {
    console.error("Error searching shows:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const getAllGenresTopShows = async (req: Request, res: Response) => {
  try {
    const allShows = await getAllShows(); // 모든 쇼 데이터 가져오기
    const genres = ["Concerts", "Musical", "Children/Family", "Exhibition"]; // 장르 목록

    const genreData = genres.map((genre) => {
      // 각 장르별 데이터 필터링 후 상위 5개 선택
      const topShows = allShows
        .filter((show) => show.genre.toLowerCase() === genre.toLowerCase())
        .sort((a, b) => a.ranking - b.ranking)
        .slice(0, 5);
      return { genre, topShows };
    });

    res.status(200).json(genreData); // 각 장르별 데이터 반환
  } catch (error) {
    console.error("Error fetching genre data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
