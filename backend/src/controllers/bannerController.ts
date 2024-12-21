import { Request, Response } from "express";
import fs from "fs";
import path from "path";

// 배너 이미지 목록 API
export const getBanners = async (req: Request, res: Response) => {
  try {
    const bannersDirectory = path.join(__dirname, "../../uploads/banners");
    const files = fs.readdirSync(bannersDirectory);

    // 이미지 파일만 필터링
    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|gif)$/i.test(file)
    );

    // 파일 경로를 클라이언트가 접근 가능한 경로로 변환
    const bannerUrls = imageFiles.map((file) => `/uploads/banners/${file}`);

    res.status(200).json({ success: true, banners: bannerUrls });
  } catch (error) {
    console.error("Error fetching banner images:", error);
    res.status(500).json({ success: false, error: "Failed to load banners" });
  }
};
