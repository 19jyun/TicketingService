import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SearchCard from "../components/SearchCard";
import { searchShows } from "../services/showService";
import { Show } from "../types/Show";
import styles from "../styles/pages/SearchResult.module.css";

const SearchResult: React.FC = () => {
  const [filteredShows, setFilteredShows] = useState<Show[]>([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query") || "";

  useEffect(() => {
    const fetchFilteredShows = async () => {
      try {
        const shows = await searchShows(query);
        setFilteredShows(shows);
      } catch (error) {
        console.error("Error fetching shows:", error);
      }
    };

    fetchFilteredShows();
  }, [query]);

  return (
    <div className={styles.container}>
      {filteredShows.length > 0 ? (
        filteredShows.map((show) => (
          <SearchCard
            key={show.show_id}
            show_id={show.show_id}
            title={show.title}
            genre={show.genre}
            release_date={show.release_date}
            ranking={show.ranking}
          />
        ))
      ) : (
        <p className={styles.emptyMessage}>Search result is empty.</p>
      )}
    </div>
  );
};

export default SearchResult;
