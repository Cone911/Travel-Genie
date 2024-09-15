import React from 'react';
import SearchBar from '../../components/SearchBar/SearchBar';
import PopularDestinations from '../../components/PopularDestinations/PopularDestinations';
import Sidebar from '../../components/Sidebar/Sidebar';
import '../HomePage/HomePage.css';

export default function HomePage({ toggleSidebar, isSidebarVisible }) {
  return (
    <div className="home-page">
      <Sidebar toggleSidebar={toggleSidebar} isSidebarVisible={isSidebarVisible} />
      <div className="main-content">
        <SearchBar />
        <PopularDestinations />
      </div>
    </div>
  );
}
