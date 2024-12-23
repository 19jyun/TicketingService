import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/components/Header.module.css';

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const { username, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/search');
    }
  };

  const handleLogout = () => {
    logout();
    setPopupMessage('Logged out successfully.');

    setTimeout(() => {
      setPopupMessage(null);
      navigate('/');
    }, 2000);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className={styles.header}>
      <h1
        className={styles.title}
        onClick={() => navigate('/')}
      >
        Let's Ticket
      </h1>

      <div className={styles.searchBar}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a show..."
          className={styles.searchInput}
        />
        <button onClick={handleSearch} className={styles.searchButton}>
          ⌕
        </button>
      </div>

      <nav className={styles.nav}>
        {username ? (
          <div>
            <span className={styles.link} onClick={handleProfileClick} style={{ cursor: 'pointer'}}> {username}</span>
            <a onClick={handleLogout} className={styles.link} style={{ cursor: 'pointer' }}>
              Logout
            </a>
          </div>
        ) : (
          <div>
            <a href="/login" className={styles.link}>
              Login
            </a>
            <a href="/signup" className={styles.link}>
              Signup
            </a>
          </div>
        )}
      </nav>

      {popupMessage && (
        <div className={styles.popup}>
          {popupMessage}
        </div>
      )}
    </header>
  );
};

export default Header;
