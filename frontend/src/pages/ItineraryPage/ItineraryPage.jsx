import ItineraryCard from '../../components/ItinerarySegment/ItinerarySegment';

export default function ItineraryPage({ itinerary, onSegmentRefresh }) {
  return (
    <div className="itinerary-page">
      <h1>Your Travel Itinerary</h1>
      <div className="itinerary-container">
        {itinerary.map((segment, index) => (
          <ItineraryCard
            key={index}
            segment={segment}
            onRefresh={() => onSegmentRefresh(index)}
          />
        ))}
      </div>
    </div>
  );
}

