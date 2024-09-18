import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { getUser } from '../../services/authService';
import './App.css';
import NavBar from '../../components/NavBar/NavBar';
import HomePage from '../HomePage/HomePage';
import ItineraryPage from '../ItineraryPage/ItineraryPage';
import SignUpPage from '../SignUpPage/SignUpPage';
import LogInPage from '../LogInPage/LogInPage';
import * as itineraryService from '../../services/itineraryService';

function App() {
  const [user, setUser] = useState(getUser());
  const [itineraries, setItineraries] = useState([]);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllItineraries = async () => {
        const fetchedItineraries = await itineraryService.index();
        setItineraries(fetchedItineraries);
    };
    if (user) fetchAllItineraries();
  }, [user]);

  const handleAddItinerary = async (itineraryData) => {
    try {
      const newItinerary = await itineraryService.create(itineraryData);
      setItineraries([newItinerary, ...itineraries]);
      navigate(`/itineraries/${newItinerary._id}`);
    } catch (err) {
      console.error('Failed to add itinerary:', err);
    }
  };

  const handleUpdateItinerary = async (itineraryId, itineraryData) => {
    try {
      const updatedItinerary = await itineraryService.update(itineraryId, itineraryData);
      setItineraries(itineraries.map(itinerary => 
        itinerary._id === itineraryId ? updatedItinerary : itinerary));
    } catch (err) {
      console.error('Failed to update itinerary:', err);
    }
  };

  const handleDeleteItinerary = async (itineraryId) => {
    try {
      await itineraryService.deleteItinerary(itineraryId);
      setItineraries(itineraries.filter(itinerary => itinerary._id !== itineraryId));
      navigate('/');
    } catch (err) {
      console.error('Failed to delete itinerary:', err);
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  // const handleSegmentRefresh = (index) => {
  //   console.log(`Refreshing segment at index ${index}`); // TODO: Add refresh segment functionality.
  // };

  return (
    <main id="react-app">
      <NavBar user={user} setUser={setUser} toggleSidebar={toggleSidebar}/>
      <section id="main-section">
        {user ? (
          <Routes>
            <Route path="/" element={<HomePage handleAddItinerary={handleAddItinerary} toggleSidebar={toggleSidebar} isSidebarVisible={isSidebarVisible} user={user} itineraries={itineraries}/>} />
            <Route path="/itineraries/:itineraryId" element={<ItineraryPage user={user} toggleSidebar={toggleSidebar} isSidebarVisible={isSidebarVisible} itineraries={itineraries} onSegmentRefresh={handleUpdateItinerary} />} />
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
