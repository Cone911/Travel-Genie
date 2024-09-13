import React from 'react';
import './Sidebar.css';

export default function Sidebar({ toggleSidebar, isSidebarVisible }) {
  const trips = ['City 1', 'City 2', 'City 3', 'City 4'];

  return (
    <div className={`sidebar ${isSidebarVisible ? 'visible' : 'hidden'}`}>
      <div className="user-icon">
        <img 
          src='../../images/user.svg'
          className="user-icon" 
        />
        <h3>Username</h3>
      </div>
      <h4>Your Trips</h4>
      <ul>
        {trips.map((trip, index) => (
          <li key={index}>{trip}</li>
        ))}
      </ul>
      <button className="logout-button">Log Out</button>
    </div>
  );
}
