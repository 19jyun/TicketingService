import express from "express";
import {
  getShows,
  getShow,
  searchShows,
  getAllGenresTopShows,
} from "../controllers/showController";

const router = express.Router();

// 검색된 쇼 반환 (구체적인 라우트가 위에 정의)
router.get("/search", searchShows);

router.get("/top-shows", getAllGenresTopShows);

// 모든 쇼 반환
router.get("/", getShows);

// 특정 쇼 반환
router.get("/:id", getShow);

export default router;
