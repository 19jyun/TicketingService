import React from "react";
import { Show } from "../types/Show";
import styles from "../styles/components/ShowDetailForm.module.css";

interface ShowDetailFormProps {
  showData: Show;
}

const ShowDetailForm: React.FC<ShowDetailFormProps> = ({ showData }) => {
  if (!showData) {
    return <div>No show data available.</div>; // 데이터가 없는 경우 처리
  }

  return (
    <div className={styles.detailContainer}>
      {/* 포스터 이미지 */}
      <img
        src={`http://localhost:5000${showData.poster_url}`} // API 기반 포스터 경로
        alt={showData.title}
        className={styles.poster}
      />

      {/* 텍스트 정보 */}
      <div className={styles.info}>
        <h1>{showData.title}</h1>
        <p>{showData.description}</p>
        <p>
          <strong>Genre:</strong> {showData.genre}
        </p>
        <p>
          <strong>Release Date:</strong> {showData.release_date}
        </p>
        <p>
          <strong>Ranking:</strong> {showData.ranking}
        </p>
      </div>
    </div>
  );
};

export default ShowDetailForm;
