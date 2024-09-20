import React, { useState } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import LoadingButton from '@mui/lab/LoadingButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import './ItinerarySegment.css';

export default function ItinerarySegment({ segment, onSegmentRefresh, conversationHistory }) {
 const [loading, setLoading] = useState(false);
  
  const [firstLine, ...restContent] = segment.description.split('\n');
  const formattedFirstLine = firstLine.replace(':', '').trim();
  const markdownContent = restContent.join('\n');
  const htmlContent = marked(markdownContent);
  const sanitizedHTML = DOMPurify.sanitize(htmlContent);
  const imageUrl = segment.image_url || 'https://i.postimg.cc/hGs6rcYX/Image-Placeholder.png';

  const handleRefreshClick = async () => {
    setLoading(true);
    try {
      await onSegmentRefresh(segment.day_number, conversationHistory);
    } catch (err) {
      console.error('Error refreshing segment:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="itinerary-segment">
      <h2 className="itinerary-title">
          Day {segment.day_number}: {formattedFirstLine}
        </h2>
        <LoadingButton
        className="refresh-button"
        variant="outlined"
        loading={loading}  
        onClick={handleRefreshClick} 
        loadingIndicator="Refreshing..."
      >
        <FontAwesomeIcon icon={faArrowsRotate} spin style={{color: "#ffffff"}} />&nbsp; Refresh Segment
      </LoadingButton>
      <div className='portrait-wrapper'>
        <img className='watermark' src="/Travel-Genie-Watermark.png" alt="Travel-Genie-Watermark" />
        <img className="itinerary-image" src={imageUrl} alt={`Image for Day ${segment.day_number}`}
        />
      </div>
        
      <div
        className="itinerary-description"
        dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
      ></div>
      
    </div>
  );
}

