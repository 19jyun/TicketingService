import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/components/SearchCard.css";

interface SearchCardProps {
  show_id: number; // show_id는 숫자형으로 변경
  title: string;
  genre: string;
  description: string;
}

const SearchCard: React.FC<SearchCardProps> = ({
  show_id,
  title,
  genre,
  description,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/show/${show_id}`); // 클릭 시 show_id로 이동
  };

  return (
    <div className="search-card" onClick={handleCardClick}>
      <h3 className="search-card-title">{title}</h3>
      <p className="search-card-genre">{genre}</p>
      <p className="search-card-description">{description}</p>
    </div>
  );
};

export default SearchCard;
