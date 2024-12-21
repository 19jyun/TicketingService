import React, { useState, useEffect } from "react";
import { fetchAllGenresTopShows } from "../services/showService"; // API 호출
import { Show } from "../types/Show"; // 이미 정의된 Show 타입
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate
import styles from "../styles/components/GenreRankings.module.css";

const genres = ["Concerts", "Musical", "Children/Family", "Exhibition"];

const GenreRankings: React.FC = () => {
  const [allTopShows, setAllTopShows] = useState<Record<string, Show[]>>({});
  const [selectedGenre, setSelectedGenre] = useState<string>(genres[0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate(); // 페이지 이동 함수

  // Fetch top shows for all genres
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllGenresTopShows(); // API 호출
        const genreData = data.reduce((acc: Record<string, Show[]>, item) => {
          acc[item.genre] = item.topShows;
          return acc;
        }, {});
        setAllTopShows(genreData);
      } catch (error) {
        console.error("Error fetching all genres top shows:", error);
      }
    };

    fetchData();
  }, []);

  // Handle genre button click
  const handleGenreClick = (genre: string) => {
    if (genre !== selectedGenre) {
      setIsAnimating(true); // Start fade-out animation
      setTimeout(() => {
        setSelectedGenre(genre); // Update the selected genre
        setIsAnimating(false); // Start fade-in animation
      }, 300); // Animation duration (matches CSS)
    }
  };

  // Handle card click to navigate to show details
  const handleCardClick = (showId: number) => {
    navigate(`/show/${showId}`); // 상세 페이지로 이동
  };

  const topShows = allTopShows[selectedGenre] || []; // Current genre's top shows

  return (
    <div className={styles.container}>
      {/* Genre Buttons */}
      <div className={styles.genreButtons}>
        {genres.map((genre) => (
          <button
            key={genre}
            className={`${styles.genreButton} ${
              selectedGenre === genre ? styles.active : ""
            }`}
            onClick={() => handleGenreClick(genre)}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Top Shows */}
      <div
        className={`${styles.topShowsContainer} ${
          isAnimating ? styles.fadeOut : styles.fadeIn
        }`}
      >
        {topShows.map((show) => (
          <div
            key={show.show_id}
            className={styles.showCard}
            onClick={() => handleCardClick(show.show_id)} // 카드 클릭 시 상세 페이지 이동
          >
            <img
              src={`http://localhost:5000${show.poster_url}`}
              alt={show.title}
              className={styles.poster}
            />
            <h3>{show.title}</h3>
            <p>
              <strong>Release Date:</strong> {show.release_date}
            </p>
            <p>
              <strong>Ranking:</strong> {show.ranking}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenreRankings;
