import React from 'react';
import BannerCarousel from '../components/BannerCarousel';
import GenreRankings from '../components/GenreRankings';
import Footer from '../components/Footer';
import styles from '../styles/pages/MainPage.module.css';

const MainPage: React.FC = () => {
  return (
    <div className="main-page">
      <BannerCarousel />
      <GenreRankings />
      <Footer />
    </div>
  );
};

export default MainPage;