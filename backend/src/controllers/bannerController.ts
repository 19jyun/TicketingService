import { Request, Response } from "express";
import { BannerModel } from "../models/bannerModel";

export const getBanners = async (req: Request, res: Response) => {
  try {
    const { username } = req.query;

    let interest = {
      Concerts: 0.25,
      Musical: 0.25,
      "Children/Family": 0.25,
      Exhibition: 0.25,
    };
    const totalPosters = 8;

    if (username) {
      const user = BannerModel.getUserByUsername(username as string);
      if (user && user.interest) {
        interest = user.interest;
      }
    }

    const selectedPosters = BannerModel.selectPostersByInterest(
      interest,
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
