import React from 'react';
import { useParams } from 'react-router-dom';
import '../ItineraryPage/ItineraryPage.css';

export default function ItineraryPage({ user, itineraries, onSegmentRefresh }) {
  const { itineraryId } = useParams(); 

  
  const itinerary = itineraries.find(itinerary => itinerary._id === itineraryId);

  console.log('Itinerary ID from URL:', itineraryId);
  console.log('Itineraries prop:', itineraries);
  console.log('Matched itinerary:', itinerary);
  console.log('Segments:', itinerary?.segments); 

  if (!itinerary) return <div>Loading...</div>;

  return (
    <div className='main-content'>
      <div className='itinerary-title-container'>
        <h2 className='itinerary-title'>{itinerary.city}, {itinerary.country}</h2>
        <h4 className='itinerary-duration'>Duration: {itinerary.days} days</h4>
        <h4 className='itinerary-party'>Adults: {itinerary.adults}, Children: {itinerary.children}</h4>
      </div>
      <h3>Daily Plan:</h3>
      {itinerary.segments.map((segment) => (
        <div key={segment._id} className="itinerary-segment">
          <h4>Day {segment.day_number}</h4>
          <img src={segment.image_url} alt={`Day ${segment.day_number}`} />
          <p>{segment.description}</p>
          {/* Button to refresh individual segments */}
          <button onClick={() => onSegmentRefresh(segment.day_number)}>Refresh Segment</button>
        </div>
      ))}
    </div>
  );
}

