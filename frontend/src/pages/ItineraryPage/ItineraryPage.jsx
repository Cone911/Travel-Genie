import DOMPurify from 'dompurify';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBusinessTime, faPerson, faChildren, faTrash } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../../components/Sidebar/Sidebar';
import ItinerarySegment from '../../components/ItinerarySegment/ItinerarySegment';
import * as itineraryService from '../../services/itineraryService';
import '../ItineraryPage/ItineraryPage.css';

export default function ItineraryPage({ 
  user, 
  toggleSidebar, 
  isSidebarVisible, 
  itineraries, 
  handleDeleteItinerary
}) {
    
  const { itineraryId } = useParams(); 
  const itinerary = itineraries.find(itinerary => itinerary._id === itineraryId);
  const [currentItinerary, setCurrentItinerary] = useState(itinerary || null);

  useEffect(() => {
    if (itinerary) {
      setCurrentItinerary(itinerary);
    }
  }, [itinerary]);

  if (!currentItinerary) return <div>Loading...</div>;

  function handleDelete() {
    const confirmDelete = window.confirm('🧞🙏: Your wishes are my command. \n Are you sure you want to delete this itinerary?');
    if (confirmDelete) {
      handleDeleteItinerary(currentItinerary._id);
    }
  }

  async function handleSegmentRefresh(dayNumber) {
    try {
      const updatedSegment = await itineraryService.refreshSegment(itineraryId, dayNumber);
      const updatedSegments = currentItinerary.segments.map(segment => 
        segment.day_number === dayNumber ? updatedSegment : segment
      );
      setCurrentItinerary({ ...currentItinerary, segments: updatedSegments });
    } catch (err) {
      console.error('Failed to refresh segment:', err);
    }
  }

  return (
    <div className="biggest-container">
      <Sidebar toggleSidebar={toggleSidebar} isSidebarVisible={isSidebarVisible} user={user} itineraries={itineraries} />
      <div className="main-content">
        <div className="itinerary-title-container">
          <div className="itinerary-title">
            <h2>{currentItinerary.city}, {currentItinerary.country}</h2>
          </div>
          <div className="itinerary-details">
            <h4>
              <FontAwesomeIcon icon={faBusinessTime} size="lg" style={{color: "white"}} /> 
              <span style={{color: "white"}}>Duration: </span>{currentItinerary.days} days
            </h4>
            <h4>
              <FontAwesomeIcon icon={faPerson} size="lg" style={{color: "white"}} /> 
              <span style={{color: "white"}}>&nbsp; Adults: </span>{currentItinerary.adults}
            </h4>
            {currentItinerary.children > 0 && (
              <h4>
                <FontAwesomeIcon icon={faChildren} size="lg" style={{color: "#ffffff"}} /> 
                <span style={{color: "white"}}>Children: </span>{currentItinerary.children}
              </h4>
            )}
            <button className="delete-button" onClick={handleDelete}>
              <FontAwesomeIcon icon={faTrash} style={{ color: 'white' }} /> Delete
            </button>
          </div>
        </div>

        {/* Render each itinerary segment */}
        {currentItinerary.segments && currentItinerary.segments.map((segment) => (
          <ItinerarySegment 
            key={segment._id} 
            segment={segment} 
            onSegmentRefresh={handleSegmentRefresh} 
          />
        ))}
      </div>
    </div>
  );
}
