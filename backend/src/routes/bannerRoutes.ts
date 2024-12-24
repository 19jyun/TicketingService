import express from "express";
import { getBanners } from "../controllers/bannerController";

const router = express.Router();

router.get("/", getBanners);

export default router;
