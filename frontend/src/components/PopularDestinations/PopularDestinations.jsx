import './PopularDestinations.css';

export default function PopularDestinations() {
  const destinations = [
    { id: 1, city: 'Bangkok', country: 'Thailand', days: 3, likes: 15, imageUrl: '../../images/Destinations/Bangkok.jpg' },
    { id: 2, city: 'Paris', country: 'France', days: 5, likes: 25, imageUrl: '../../images/Destinations/Paris.jpg' },
    { id: 3, city: 'Tokyo', country: 'Japan', days: 10, likes: 25, imageUrl: '../../images/Destinations/Tokyo.jpg' },
    { id: 4, city: 'New York', country: 'USA', days: 3, likes: 0, imageUrl: '../../images/Destinations/NewYork.jpg' },
    { id: 5, city: 'New York', country: 'USA', days: 3, likes: 0, imageUrl: '../../images/Destinations/NewYork.jpg' },
    { id: 6, city: 'New York', country: 'USA', days: 3, likes: 0, imageUrl: '../../images/Destinations/NewYork.jpg' },
    { id: 7, city: 'New York', country: 'USA', days: 3, likes: 0, imageUrl: '../../images/Destinations/NewYork.jpg' },
    { id: 8, city: 'New York', country: 'USA', days: 3, likes: 0, imageUrl: '../../images/Destinations/NewYork.jpg' },
  ];

  return (
    <div className="popular-destinations">
      <div className='popular-destinations-title'>
        <h2>Popular Destinations</h2>
      </div>
      <div className="destinations-carousel">
        {destinations.map((destination) => (
          <div
            key={destination.id}
            className="destination-card"
            style={{ backgroundImage: `url(${destination.imageUrl})` }}
          >
            <div className="destination-info">
              <h3 className='destination-city'>{destination.city}</h3>
              <h4 className='destination-country'>{destination.country}</h4>
              <h4 className='destination-days'>{destination.days} days</h4>
            </div>
            <button className="like-button">❤️ {destination.likes}</button>
          </div>
        ))}
      </div>
    </div>
  );
}