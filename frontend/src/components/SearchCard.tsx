import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/components/SearchCard.css";

interface SearchCardProps {
  show_id: number;
  title: string;
  genre: string;
  release_date: string;
  ranking: number;  // 랭킹 추가
}

const SearchCard: React.FC<SearchCardProps> = ({
  show_id,
  title,
  genre,
  release_date,
  ranking,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/show/${show_id}`); // 클릭 시 show_id로 이동
  };

  return (
    <div className="search-card" onClick={handleCardClick}>
      <img src={`http://localhost:5000/uploads/posters/${show_id}.jpg`} alt={title} />
      <h3 className="search-card-title">{title}</h3>
      <p className="search-card-genre">{genre}</p>
      <p className="search-card-release-date">{release_date}</p>
       <p className="search-card-ranking">Rank: {ranking}</p>
    </div>
  );
};

export default SearchCard;
