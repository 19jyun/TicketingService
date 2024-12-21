import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // AuthContext를 통해 상태 관리
import styles from '../styles/components/Header.module.css'; // CSS 모듈 import

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [popupMessage, setPopupMessage] = useState<string | null>(null); // 팝업 메시지 상태
  const { username, logout } = useAuth(); // 전역 상태에서 로그인 정보와 로그아웃 함수 가져오기
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`); // 검색 결과 페이지로 이동
    } else {
      navigate('/search'); // 검색어가 없으면 전체 목록 표시
    }
  };

  const handleLogout = () => {
    logout(); // Context를 통해 전역 상태에서 사용자 로그아웃 처리
    setPopupMessage('Logged out successfully.'); // 팝업 메시지 설정

    // 팝업 메시지 2초 후 자동 숨기기
    setTimeout(() => {
      setPopupMessage(null);
      navigate('/'); // 로그아웃 후 메인 페이지로 이동
    }, 2000);
  };

  const handleProfileClick = () => {
    navigate('/profile'); // UserProfile 페이지로 이동
  };

  return (
    <header className={styles.header}>
      {/* 제목 */}
      <h1
        className={styles.title}
        onClick={() => navigate('/')} // 메인 페이지로 이동
      >
        Let's Ticket
      </h1>

      {/* 검색 바 */}
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

      {/* 네비게이션 */}
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

      {/* 팝업 메시지 */}
      {popupMessage && (
        <div className={styles.popup}>
          {popupMessage}
        </div>
      )}
    </header>
  );
};

export default Header;
