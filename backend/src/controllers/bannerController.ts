import { Request, Response } from "express";
import { BannerModel } from "../models/bannerModel";

export const getBanners = async (req: Request, res: Response) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res
        .status(400)
        .json({ success: false, error: "Username is required." });
    }

    // 유저 데이터 가져오기
    const user = BannerModel.getUserByUsername(username as string);
    if (!user || !user.interest) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    // 관심도 비율에 따라 포스터 선택
    const totalPosters = 8;
    const selectedPosters = BannerModel.selectPostersByInterest(
      user.interest,
      totalPosters
    );

    res.status(200).json({
      success: true,
      banners: selectedPosters.map((poster) => poster.poster_url),
    });
  } catch (error) {
    console.error("Error fetching banners:", error);
    res.status(500).json({ success: false, error: "Failed to load banners." });
  }
};
