import React from 'react';
import BannerCarousel from '../components/BannerCarousel';
import GenreRankings from '../components/GenreRankings';
import styles from '../styles/pages/MainPage.module.css';

const MainPage: React.FC = () => {
  return (
    <div className="main-page">
      <BannerCarousel />
      <GenreRankings />
    </div>
  );
};

export default MainPage;