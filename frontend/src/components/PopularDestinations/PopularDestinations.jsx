import React from 'react';
import './PopularDestinations.css';

export default function PopularDestinations() {
  const destinations = [
    { id: 1, name: 'Bangkok', country: 'Thailand', days: 3, likes: 15, imageUrl: '/path/to/bangkok.jpg' },
    { id: 2, name: 'Paris', country: 'France', days: 5, likes: 25, imageUrl: '/path/to/paris.jpg' },
    { id: 3, name: 'Tokyo', country: 'Japan', days: 10, likes: 25, imageUrl: '/path/to/tokyo.jpg' },
    { id: 4, name: 'New York', country: 'USA', days: 3, likes: 0, imageUrl: '/path/to/newyork.jpg' },
  ];

  return (
    <div className="popular-destinations">
      <h2>Popular Destinations</h2>
      <div className="destinations-carousel">
        {destinations.map((destination) => (
          <div key={destination.id} className="destination-card">
            <img src={destination.imageUrl} alt={destination.name} />
            <div className="destination-info">
              <h3>{destination.name}</h3>
              <p>{destination.country}</p>
              <p>{destination.days} days</p>
              <button className="like-button">❤️ {destination.likes}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
