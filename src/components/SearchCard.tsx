import React from 'react';
import '../styles/components/SearchCard.css';

interface SearchCardProps {
  title: string;
  genre: string;
  description: string;
}

const SearchCard: React.FC<SearchCardProps> = ({ title, genre, description }) => {
  return (
    <div className="search-card">
      <h3 className="search-card-title">{title}</h3>
      <p className="search-card-genre">{genre}</p>
      <p className="search-card-description">{description}</p>
    </div>
  );
};

export default SearchCard;
