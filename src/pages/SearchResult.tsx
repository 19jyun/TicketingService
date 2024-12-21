import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { useLocation } from 'react-router-dom';
import SearchCard from '../components/SearchCard';
import { filterShows } from '../services/searchService';
import { Show } from '../types/Show';

const SearchResult: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [filteredShows, setFilteredShows] = useState<Show[]>([]);

  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query') || ''; // URL에서 검색어 가져오기

  useEffect(() => {
    Papa.parse('/data/shows.csv', {
      download: true,
      header: true,
      complete: (result) => {
        const showData = result.data as Show[];
        setShows(showData);
        setFilteredShows(filterShows(showData, query)); // 검색어에 따라 필터링
      },
    });
  }, []);
    
  useEffect(() => {
    console.log('Filtered Shows:', filteredShows); // 필터링 결과 출력
  }, [filteredShows]);

  return (
    <div style={styles.container}>
      {filteredShows.map((show) => (
        <SearchCard
          key={show.show_id} // 고유한 key 전달
          title={show.title}
          genre={show.genre}
          description={show.description}
        />
      ))}
    </div>
  );
};

const styles: { container: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column', // 세로 정렬
    alignItems: 'center', // 카드 중앙 정렬
    padding: '20px 0',
    backgroundColor: '#f9f9f9', // 배경 색상 추가
    overflowY: 'auto', // 스크롤 가능
  },
};

export default SearchResult;
