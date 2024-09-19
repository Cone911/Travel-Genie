import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import './PopularDestinations.css';
import * as itineraryService from '../../services/itineraryService';

export default function PopularDestinations() {
  const [destinations, setDestinations] = useState([]);

  // Fetch public itineraries on component mount
  useEffect(() => {
    async function fetchPublicItineraries() {
      try {
        const publicItineraries = await itineraryService.getPublicItineraries(); // Assuming this API call exists
        setDestinations(publicItineraries);
      } catch (error) {
        console.error('Error fetching public itineraries:', error);
      }
    }
    fetchPublicItineraries();
  }, []);

  async function handleLike(itineraryId) {
    try {
      await itineraryService.likeItinerary(itineraryId);
      // Refetch all itineraries after liking
      const publicItineraries = await itineraryService.getPublicItineraries();
      setDestinations(publicItineraries);
    } catch (error) {
      console.error('Error liking itinerary:', error);
    }
  }
  

  return (
    <div className="popular-destinations">
      <div className='popular-destinations-title'>
        <h2>Community's Wishes</h2>
      </div>
      <div className="destinations-carousel">
        {destinations.length > 0 ? (
          destinations.map((destination) => (
            <div
              key={destination._id} // assuming _id comes from the backend
              className="destination-card"
              style={{ backgroundImage: `url(${destination.segments[0]?.image_url || '../../images/Destinations/Default.jpg'})` }} // fallback to a default image
            >
              <div className="destination-info">
                <h3 className='destination-city'>{destination.city}</h3>
                <h4 className='destination-country'>{destination.country}</h4>
                <h4 className='destination-days'>{destination.days} days</h4>
              </div>
              <div className='bottom-row'>
                <h5 className='destination-user'><FontAwesomeIcon className='icon' icon={faUser} size="lg" style={{color: "goldenrod"}}/> By: {destination.user.name}</h5>
                <button 
                className="like-button" 
                onClick={() => handleLike(destination._id)}
              >
                ❤️ {destination.likes.length}
              </button>
              </div>
            </div>
          ))
        ) : (
          <p>No popular destinations yet.</p>
        )}
      </div>
    </div>
  );
}