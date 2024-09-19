import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBusinessTime, faPerson, faChildren, faTrash } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../../components/Sidebar/Sidebar';
import ItinerarySegment from '../../components/ItinerarySegment/ItinerarySegment';
import MaterialUISwitch from '../../components/MaterialUISwitch/MaterialUISwitch';
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
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    if (itinerary) {
      setCurrentItinerary(itinerary);
      setIsPublic(itinerary.is_public);
    }
  }, [itinerary]);

  if (!currentItinerary) return <div>Loading...</div>;

  function handleDelete() {
    const confirmDelete = window.confirm('🧞🙏: Your wishes are my command. \n Are you sure you want to delete this itinerary?');
    if (confirmDelete) {
      handleDeleteItinerary(currentItinerary._id);
    }
  }

  async function handleSegmentRefresh(dayNumber, conversationHistory) {
    try {
      const updatedSegment = await itineraryService.refreshSegment(itineraryId, dayNumber, conversationHistory);
      const updatedSegments = currentItinerary.segments.map(segment => 
        segment.day_number === dayNumber ? updatedSegment : segment
      );
      setCurrentItinerary({ ...currentItinerary, segments: updatedSegments });
      setConversationHistory([...conversationHistory, {
        role: 'assistant', 
        content: updatedSegment.description
      }]);
    } catch (err) {
      console.error('Failed to refresh segment:', err);
    }
  }

  async function togglePublicStatus() {
    const updatedIsPublic = !isPublic;
    setIsPublic(updatedIsPublic);
    await itineraryService.update(itineraryId, { is_public: updatedIsPublic });
  }

  return (
    <div className="biggest-container">
      <Sidebar toggleSidebar={toggleSidebar} isSidebarVisible={isSidebarVisible} user={user} itineraries={itineraries} />
      <div className="main-content">
        <div className="itinerary-title-container">
          <div className="itinerary-title">
            <h2>{currentItinerary.city}, {currentItinerary.country}</h2>
          <div className="public-toggle">
            <MaterialUISwitch checked={isPublic} onChange={togglePublicStatus} />
            <span className='switch-label' style={{ color: "white", marginLeft: "8px" }}>
              {isPublic ? "Public" : "Private"}
            </span>
          </div>
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
        {currentItinerary.segments && currentItinerary.segments.map((segment) => (
          <ItinerarySegment 
            key={segment._id} 
            segment={segment} 
            onSegmentRefresh={(dayNumber) => handleSegmentRefresh(dayNumber, conversationHistory)}  
            conversationHistory={conversationHistory}
          />
        ))}
      </div>
    </div>
  );
}
