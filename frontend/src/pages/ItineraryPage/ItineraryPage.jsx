import React from 'react';
import { useParams } from 'react-router-dom';
import ImagePlaceholder from '../../../images/ImagePlaceholder.png'
import '../ItineraryPage/ItineraryPage.css';

export default function ItineraryPage({ user, itineraries, onSegmentRefresh }) {
  const { itineraryId } = useParams(); 

  
  const itinerary = itineraries.find(itinerary => itinerary._id === itineraryId); 

  if (!itinerary) return <div>Loading...</div>;

  const formattedSegments = itinerary.segments.map((segment) => {
  const [firstLine, ...restContent] = segment.description.split('\n');
  const formattedFirstLine = firstLine.replace(':', '').trim();

  return {
      ...segment,
      formattedFirstLine,
      restContent,
      imageUrl: segment.image_url || ImagePlaceholder,
    };
  });

  return (
    <div className='main-content'>
      <div className='itinerary-title-container'>
        <h2 className='itinerary-title'>{itinerary.city}, {itinerary.country}</h2>
        <h4 className='itinerary-duration'>Duration: {itinerary.days} days</h4>
        <h4 className='itinerary-party'>Adults: {itinerary.adults}, Children: {itinerary.children}</h4>
      </div>
      {itinerary.segments.map((segment) => (
        <div key={segment._id} className="itinerary-segment">
          <img className='itinerary-image' src={ImagePlaceholder} alt={`Image for Day ${segment.day_number}`} />
          <h4 className='itinerary-title'>Day {segment.day_number}</h4>
          <p className='itinerary-description'>
            {segment.description.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
          </p>
          <button className='itinerary-refresh-button' onClick={() => onSegmentRefresh(segment.day_number)}>Refresh Segment</button>
        </div>
      ))}
    </div>
  );
}

