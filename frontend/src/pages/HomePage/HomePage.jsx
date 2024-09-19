import React from 'react';
import SearchBar from '../../components/SearchBar/SearchBar';
import PopularDestinations from '../../components/PopularDestinations/PopularDestinations';
import Sidebar from '../../components/Sidebar/Sidebar';
import '../HomePage/HomePage.css';

export default function HomePage({ toggleSidebar, isSidebarVisible, handleAddItinerary, user, itineraries }) {
  
  return (
    <div className="biggest-container">
      <Sidebar toggleSidebar={toggleSidebar} isSidebarVisible={isSidebarVisible} user={user} itineraries={itineraries}/>
      <div className="main-content">
        <SearchBar handleAddItinerary={handleAddItinerary}/>
        <PopularDestinations />
      </div>
    </div>
  );
}
