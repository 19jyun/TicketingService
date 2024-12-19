import React from 'react';
import BannerCarousel from '../components/BannerCarousel';
import GenreRankings from '../components/GenreRankings';
import Footer from '../components/Footer';

const MainPage: React.FC = () => {
  const musicalEvents = [
    { title: 'Phantom of the Opera', date: 'Dec 1, 2024 - Jan 31, 2025', venue: 'Seoul Arts Center' },
    { title: 'Les Misérables', date: 'Nov 15, 2024 - Dec 30, 2024', venue: 'Blue Square' },
  ];

  const concertEvents = [
    { title: 'BTS World Tour', date: 'Mar 5, 2025', venue: 'Jamsil Stadium' },
    { title: 'IU Live Concert', date: 'Feb 20, 2025', venue: 'Olympic Gymnastics Arena' },
  ];

  return (
    <div className="main-page">
      <BannerCarousel />
      <section className="genre-rankings">
        <h2>Top Events</h2>
        <GenreRankings category="Musicals" events={musicalEvents} />
        <GenreRankings category="Concerts" events={concertEvents} />
      </section>
      <Footer />
    </div>
  );
};

export default MainPage;