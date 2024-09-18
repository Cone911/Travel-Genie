import React from 'react';
import { useParams } from 'react-router-dom';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBusinessTime, faPerson, faChildren } from '@fortawesome/free-solid-svg-icons'
import Sidebar from '../../components/Sidebar/Sidebar';
import '../ItineraryPage/ItineraryPage.css';

export default function ItineraryPage({ user, toggleSidebar, isSidebarVisible, itineraries, onSegmentRefresh }) {
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
    <div className="biggest-container">
      <Sidebar toggleSidebar={toggleSidebar} isSidebarVisible={isSidebarVisible} user={user} itineraries={itineraries}/>
      <div className='main-content'>
        <div className='itinerary-title-container'>
          <div className='itinerary-title'>
            <h2>{itinerary.city}, {itinerary.country}</h2>
          </div>
          <div className='itinerary-details'>
            <h4><FontAwesomeIcon icon={faBusinessTime} size="lg" style={{color: "white",}} /> <span style={{color: "white"}}>Duration: </span>{itinerary.days} days</h4>
            <h4><FontAwesomeIcon icon={faPerson} size="lg" style={{color: "white",}} /> <span style={{color: "white"}}>&nbsp; Adults: </span>{itinerary.adults}</h4>
            {itinerary.children === 0 ? '' :
            <h4><FontAwesomeIcon icon={faChildren} size="lg" style={{color: "#ffffff",}} /> <span style={{color: "white"}}>Children: </span>{itinerary.children}</h4>
            }
          </div>
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
    </div>
  

  );
}

