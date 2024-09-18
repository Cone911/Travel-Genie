import { Link } from 'react-router-dom';
import ReactCountryFlag from 'react-country-flag';
import { getCountryCode } from '../../utils/contryCodes';
import './Sidebar.css';
import { faAlignCenter } from '@fortawesome/free-solid-svg-icons';

export default function Sidebar({ toggleSidebar, isSidebarVisible, user, itineraries }) {
  const trips = ['City 1', 'City 2', 'City 3', 'City 4'];

  return (
    <div className={`sidebar ${isSidebarVisible ? 'visible' : 'hidden'}`}>
      <div className="user-icon">
        <img 
          src='../../images/user.svg'
          className="user-icon" 
        />
        <h3 className='username-title'>{user.name}</h3>
      </div>
      <h4 className='yourTrips-title'>Your Wish List</h4>
      <div className='itineraries-container'>
        {itineraries.map((itinerary) => {
          const countryCode = getCountryCode(itinerary.country);
          return (
            <div className='itinerary-item' key={itinerary._id}>
              <Link className='itinerary-link' to={`/itineraries/${itinerary._id}`}>
              <ReactCountryFlag className='country-flag' countryCode={countryCode} svg 
              style={{
                  width: '3vmin',
                  height: '100%',
                  marginRight: '0px'
                }}
                title={itinerary.country}
              />
                {itinerary.city}
              </Link>
              
            </div>
          );
        })}
      </div>
    </div>
  );
}
