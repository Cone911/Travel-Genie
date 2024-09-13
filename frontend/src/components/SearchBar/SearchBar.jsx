// src/components/SearchBar/SearchBar.jsx

import React from 'react';
import './SearchBar.css';

export default function SearchBar() {
  return (
    <div className="search-bar">
      <input type="text" placeholder="Pick a Destination" className="search-input" />
      <input type="text" placeholder="Trip Duration" className="search-input" />
      <input type="text" placeholder="Party Size" className="search-input" />
      <button className="search-button">Ask the Genie!</button>
    </div>
  );
}
