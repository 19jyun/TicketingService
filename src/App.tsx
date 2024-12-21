import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import MainPage from './pages/MainPage';
import {Login} from './pages/Login';
import Signup from './pages/Signup';
import SearchResult from './pages/SearchResult';
import UserProfile from './pages/UserProfile';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/search" element={<SearchResult />} /> {/* /search 경로 추가 */}
        <Route path="/profile" element={<UserProfile/>} /> {/* /profile 경로 추가 */}
      </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App; 