import React, { useState } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
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
      <img
        className="itinerary-image"
        src={imageUrl}
        alt={`Image for Day ${segment.day_number}`}
      />
      <h4 className="itinerary-title">
        Day {segment.day_number}: {formattedFirstLine}
      </h4>
      <div
        className="itinerary-description"
        dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
      ></div>
      <button
        className="itinerary-refresh-button"
        onClick={handleRefreshClick}
        disabled={loading}
      >
        {loading ? 'Refreshing...' : 'Refresh Segment'}
      </button>
    </div>
  );
}

