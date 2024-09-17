import React from 'react';
import { useParams } from 'react-router-dom';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import '../ItineraryPage/ItineraryPage.css';

export default function ItineraryPage({ user, itineraries, onSegmentRefresh }) {
  const { itineraryId } = useParams(); 

  
  const itinerary = itineraries.find(itinerary => itinerary._id === itineraryId); 

  if (!itinerary) return <div>Loading...</div>;

  const formattedSegments = itinerary.segments.map((segment) => {
  const [firstLine, ...restContent] = segment.description.split('\n');
  const formattedFirstLine = firstLine.replace(':', '').trim();
  const markdownContent = restContent.join('\n');
  const htmlContent = marked(markdownContent);
  const sanitizedHTML = DOMPurify.sanitize(htmlContent);

  return {
      ...segment,
      formattedFirstLine,
      sanitizedHTML,
      imageUrl: segment.image_url
    };
  });

  return (
    <div className='main-content'>
      <div className='itinerary-title-container'>
        <h2 className='itinerary-title'>{itinerary.city}, {itinerary.country}</h2>
        <h4 className='itinerary-duration'>Duration: {itinerary.days} days</h4>
        <h4 className='itinerary-party'>Adults: {itinerary.adults}, Children: {itinerary.children}</h4>
      </div>
      {formattedSegments.map((segment) => (
        <div key={segment._id} className="itinerary-segment">
          <img
            className="itinerary-image"
            src={segment.imageUrl}
            alt={`Image for Day ${segment.day_number}`}
          />
          <h4 className="itinerary-title">
            Day {segment.day_number}: {segment.formattedFirstLine}
          </h4>
          <div className="itinerary-description" dangerouslySetInnerHTML={{ __html: segment.sanitizedHTML }}></div>
          <button className='itinerary-refresh-button' onClick={() => onSegmentRefresh(segment.day_number)}>Refresh Segment</button>
        </div>
      ))}
    </div>
  );
}

