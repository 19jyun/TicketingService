import React, { useState, useEffect } from "react";
import { fetchAllGenresTopShows } from "../services/showService";
import { Show } from "../types/Show";
import { useNavigate } from "react-router-dom";
import styles from "../styles/components/GenreRankings.module.css";

const genres = ["Concerts", "Musical", "Children/Family", "Exhibition"];

const GenreRankings: React.FC = () => {
  const [allTopShows, setAllTopShows] = useState<Record<string, Show[]>>({});
  const [selectedGenre, setSelectedGenre] = useState<string>(genres[0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllGenresTopShows();
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

  const handleGenreClick = (genre: string) => {
    if (genre !== selectedGenre) {
      setIsAnimating(true);
      setTimeout(() => {
        setSelectedGenre(genre);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleCardClick = (showId: number) => {
    navigate(`/show/${showId}`);
  };

  const topShows = allTopShows[selectedGenre] || [];

  return (
    <div className={styles.container}>
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

      <div
        className={`${styles.topShowsContainer} ${
          isAnimating ? styles.fadeOut : styles.fadeIn
        }`}
      >
        {topShows.map((show) => (
          <div
            key={show.show_id}
            className={styles.showCard}
            onClick={() => handleCardClick(show.show_id)}
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
