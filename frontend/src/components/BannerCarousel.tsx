import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBanners } from "../services/bannerService"; // Banner API 호출
import { useAuth } from "../contexts/AuthContext"; // useAuth 훅을 가져옵니다.
import styles from "../styles/components/BannerCarousel.module.css";

const BannerCarousel: React.FC = () => {
  const [bannerImages, setBannerImages] = useState<string[]>([]); // 배너 이미지 배열
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 슬라이드 인덱스
  const [isTransitioning, setIsTransitioning] = useState(false); // 슬라이드 애니메이션 상태
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // 슬라이드 자동 전환 타이머
  const navigate = useNavigate();
  const user = useAuth(); // useAuth 훅을 호출하여 사용자 정보 가져오기

  // 배너 데이터 로드
  useEffect(() => {
    const loadBanners = async () => {
      if (!user || !user.username) {
        console.error("User is not authenticated");
        return;
      }

      try {
        const response = await fetchBanners(user.username); // Banner 데이터 API 호출
        console.log("Fetched banners:", response.banners); // 로드된 데이터 확인
        setBannerImages(response.banners); // 배너 이미지 배열 설정
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    loadBanners();
    startTimer(); // 슬라이드 자동 전환 시작

    return () => stopTimer(); // 컴포넌트 언마운트 시 타이머 제거
  }, [user]);

  // 타이머 시작
  const startTimer = () => {
    stopTimer(); // 기존 타이머 제거
    intervalRef.current = setInterval(() => {
      handleNextSlide();
    }, 3000); // 3초마다 슬라이드 전환
  };

  // 타이머 중지
  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // 다음 슬라이드로 이동
  const handleNextSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
      setIsTransitioning(false);
    }, 500); // CSS 애니메이션 시간과 동일
  };

  // 썸네일 클릭 이벤트
  const handleMiniatureClick = (index: number) => {
    setCurrentIndex(index); // 클릭한 인덱스로 이동
    stopTimer(); // 슬라이드 타이머 정지
    startTimer(); // 타이머 재시작
  };

  // 배너 이미지 클릭 시 상세 페이지로 이동
  const handleImageClick = (imagePath: string) => {
    const showId = imagePath.split("/").pop()?.split(".")[0]; // 이미지 이름에서 showId 추출
    if (showId) {
      stopTimer();
      navigate(`/show/${showId}`); // `/show/:id` 경로로 이동
    }
  };

  // 로딩 중 처리
  if (!bannerImages.length) {
    return <div>Loading banners...</div>;
  }

  return (
    <div className={styles.carouselContainer}>
      {/* 슬라이드 이미지 */}
      <div
        className={`${styles.imageContainer} ${
          isTransitioning ? styles.sliding : ""
        }`}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {bannerImages.map((image, index) => (
          <img
            key={index}
            src={`http://localhost:5000${image}`} // URL에 localhost 경로 추가
            alt={`Banner ${index}`}
            className={styles.carouselImage}
            onClick={() => handleImageClick(image)} // 이미지 클릭 이벤트
          />
        ))}
      </div>

      {/* 썸네일 */}
      <div className={styles.miniaturesContainer}>
        {bannerImages.map((image, index) => (
          <div
            key={index}
            className={`${styles.miniature} ${
              index === currentIndex ? styles.active : ""
            }`}
            onClick={() => handleMiniatureClick(index)} // 썸네일 클릭 이벤트
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
