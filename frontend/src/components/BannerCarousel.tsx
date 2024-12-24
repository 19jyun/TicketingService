import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBanners } from "../services/bannerService";
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/components/BannerCarousel.module.css";

const BannerCarousel: React.FC = () => {
  const [bannerImages, setBannerImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const user = useAuth();

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const response = await fetchBanners(user?.username || "");
        console.log("Fetched banners:", response.banners);
        setBannerImages(response.banners);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    loadBanners();
    startTimer();

    return () => stopTimer();
  }, [user]);

  const startTimer = () => {
    stopTimer();
    intervalRef.current = setInterval(() => {
      handleNextSlide();
    }, 3000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleNextSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
      setIsTransitioning(false);
    }, 500);
  };

  const handleMiniatureClick = (index: number) => {
    setCurrentIndex(index);
    stopTimer();
    startTimer();
  };

  const handleImageClick = (imagePath: string) => {
    const showId = imagePath.split("/").pop()?.split(".")[0];
    if (showId) {
      stopTimer();
      navigate(`/show/${showId}`);
    }
  };

  if (!bannerImages.length) {
    return <div>Loading banners...</div>;
  }

  return (
    <div className={styles.carouselContainer}>
      <div
        className={`${styles.imageContainer} ${
          isTransitioning ? styles.sliding : ""
        }`}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {bannerImages.map((image, index) => (
          <img
            key={index}
            src={`http://localhost:5000${image}`}
            alt={`Banner ${index}`}
            className={styles.carouselImage}
            onClick={() => handleImageClick(image)}
          />
        ))}
      </div>

      <div className={styles.miniaturesContainer}>
        {bannerImages.map((image, index) => (
          <div
            key={index}
            className={`${styles.miniature} ${
              index === currentIndex ? styles.active : ""
            }`}
            onClick={() => handleMiniatureClick(index)}
          >
            <img
              src={`http://localhost:5000${image}`}
              alt={`Miniature ${index}`}
              className={styles.miniatureImage}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
