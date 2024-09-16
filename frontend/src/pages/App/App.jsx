import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { getUser } from '../../services/authService';
import './App.css';
import NavBar from '../../components/NavBar/NavBar';
import HomePage from '../HomePage/HomePage';
import PostListPage from '../PostListPage/PostListPage';
import ItineraryPage from '../ItineraryPage/ItineraryPage';
import SignUpPage from '../SignUpPage/SignUpPage';
import LogInPage from '../LogInPage/LogInPage';

function App() {
  const [user, setUser] = useState(getUser());
  const [itinerary, setItinerary] = useState([]);
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const handleSegmentRefresh = (index) => {
    console.log(`Refreshing segment at index ${index}`); // TODO: Add refresh segment functionality.
  };

  return (
    <main id="react-app">
      <NavBar user={user} setUser={setUser} toggleSidebar={toggleSidebar}/>
      <section id="main-section">
        {user ? (
          <Routes>
            <Route path="/" element={<HomePage toggleSidebar={toggleSidebar} isSidebarVisible={isSidebarVisible} />} />
            <Route path="/itinerary" element={<ItineraryPage itinerary={itinerary} onSegmentRefresh={handleSegmentRefresh} />} />
            <Route path="/posts" element={<PostListPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<HomePage toggleSidebar={toggleSidebar} isSidebarVisible={isSidebarVisible} />} />
            <Route path="/login" element={<LogInPage setUser={setUser} />} />
            <Route path="/signup" element={<SignUpPage setUser={setUser} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </section>
    </main>
  );
}

export default App;
