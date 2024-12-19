import React from 'react';

const BannerCarousel: React.FC = () => {
  return (
    <section className="banner-carousel">
      <div className="carousel-item">
        <img src="/images/banner1.jpg" alt="Featured Event 1" />
      </div>
      <div className="carousel-item">
        <img src="/images/banner2.jpg" alt="Featured Event 2" />
      </div>
    </section>
  );
};

export default BannerCarousel;