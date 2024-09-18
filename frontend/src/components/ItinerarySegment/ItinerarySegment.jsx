import React from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import './ItinerarySegment.css';

export default function ItinerarySegment({ segment, onSegmentRefresh }) {
  const [firstLine, ...restContent] = segment.description.split('\n');
  const formattedFirstLine = firstLine.replace(':', '').trim();
  const markdownContent = restContent.join('\n');
  const htmlContent = marked(markdownContent);
  const sanitizedHTML = DOMPurify.sanitize(htmlContent);
  const imageUrl = segment.image_url || 'https://i.postimg.cc/hGs6rcYX/Image-Placeholder.png';

  return (
    <div className="itinerary-segment">
      {/* Image */}
      <img
        className="itinerary-image"
        src={imageUrl}
        alt={`Image for Day ${segment.day_number}`}
      />

      {/* Day and title */}
      <h4 className="itinerary-title">
        Day {segment.day_number}: {formattedFirstLine}
      </h4>

      {/* Description rendered from markdown */}
      <div
        className="itinerary-description"
        dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
      ></div>

      {/* Refresh button */}
      <button
        className="itinerary-refresh-button"
        onClick={() => onSegmentRefresh(segment.day_number)}
      >
        Refresh Segment
      </button>
    </div>
  );
}

