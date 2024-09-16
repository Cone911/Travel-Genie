import './ItinerarySegment.css';

export default function ItineraryCard({ segment, onRefresh }) {
  return (
    <div className="itinerary-card">
      <img src={segment.image} alt={segment.name} className="card-image" />
      <div className="card-content">
        <h3>{segment.name}</h3>
        <p>{segment.description}</p>
        <button onClick={onRefresh} className="refresh-button">
          Refresh Segment
        </button>
      </div>
    </div>
  );
}
