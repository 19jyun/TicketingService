import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useParams } from 'react-router-dom';
import { Header } from './components/Header';
import MainPage from './pages/MainPage';
import { Login } from './pages/Login';
import Signup from './pages/Signup';
import SearchResult from './pages/SearchResult';
import UserProfile from './pages/UserProfile';
import ShowDetails from './pages/ShowDetails';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';
import ReservationResult from './pages/ReservationResult';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/search" element={<SearchResult />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/show/:show_id" element={<ShowDetails />} />
          <Route path="/reservation-result" element={<ReservationResult />} />
        </Routes>
        {/* Chatbot Component */}
        <DynamicChatbot />
      </Router>
      <Footer />
    </AuthProvider>
  );
};

const DynamicChatbot: React.FC = () => {
  const { username } = useAuth();
  const location = useLocation();
  const params = useParams<{ show_id: string }>();

  let currentPage = 'main';
  let showTitle: string | null = null;

  if (location.pathname.startsWith('/show')) {
    currentPage = 'showDetails';
    showTitle = params.show_id || null; // Assign null if no show_id exists
  } else if (location.pathname.startsWith('/profile')) {
    currentPage = 'profile';
  } else if (location.pathname.startsWith('/search')) {
    currentPage = 'search';
  } else if (location.pathname.startsWith('/login') || location.pathname.startsWith('/signup')) {
    currentPage = 'auth';
  } else if (location.pathname.startsWith('/reservation-result')) {
    currentPage = 'reservation';
  }

  return (
    <Chatbot
      loggedIn={username} // Pass login status dynamically
      currentPage={currentPage}
      showTitle={showTitle}
    />
  );
};

export default App;
