import React from "react";
import { Show } from "../types/Show";
import styles from "../styles/components/ShowDetailForm.module.css";

interface ShowDetailFormProps {
  showData: Show;
}

const ShowDetailForm: React.FC<ShowDetailFormProps> = ({ showData }) => {
  if (!showData) {
    return <div>No show data available.</div>; 
  }

  return (
    <div className={styles.detailContainer}>
      <img
        src={`http://localhost:5000${showData.poster_url}`} 
        alt={showData.title}
        className={styles.poster}
      />

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
