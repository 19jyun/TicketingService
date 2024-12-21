import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SearchCard from "../components/SearchCard";
import { searchShows } from "../services/showService"; // 백엔드 API 호출 함수
import { Show } from "../types/Show";

const SearchResult: React.FC = () => {
  const [filteredShows, setFilteredShows] = useState<Show[]>([]); // 필터링된 쇼 상태
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query") || ""; // URL에서 검색어 가져오기

  useEffect(() => {
    const fetchFilteredShows = async () => {
      try {
        const shows = await searchShows(query); // API 호출
        setFilteredShows(shows); // 결과를 상태로 설정
      } catch (error) {
        console.error("Error fetching shows:", error);
      }
    };

    fetchFilteredShows();
  }, [query]);

  return (
    <div style={styles.container}>
      {filteredShows.map((show) => (
        <SearchCard
          key={show.show_id} // 고유한 key 전달
          show_id={show.show_id}
          title={show.title}
          genre={show.genre}
          release_date={show.release_date} // release_date 전달
          ranking={show.ranking} // ranking 전달
        />
      ))}
    </div>
  );
};

const styles: { container: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column", // 세로 정렬
    alignItems: "center", // 카드 중앙 정렬
    padding: "20px 0",
    backgroundColor: "#f9f9f9", // 배경 색상 추가
    overflowY: "auto", // 스크롤 가능
  },
};

export default SearchResult;
