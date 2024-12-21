import express from "express";
import { getBanners } from "../controllers/bannerController";

const router = express.Router();

// 배너 이미지 목록 API
router.get("/", getBanners);

export default router;
