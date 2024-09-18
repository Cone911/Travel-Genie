import { Link } from 'react-router-dom';
import ReactCountryFlag from 'react-country-flag';
import { getCountryCode } from '../../utils/contryCodes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

export default function Sidebar({ toggleSidebar, isSidebarVisible, user, itineraries }) {
  const trips = ['City 1', 'City 2', 'City 3', 'City 4'];

  return (
    <div className={`sidebar ${isSidebarVisible ? 'visible' : 'hidden'}`}>
      <div className="user-icon">
        <img 
          src='../../images/user.svg'
          className="user-icon" 
        />
       {user ? (<h3 className='username-title'>{user.name}</h3>
        ) : (
          <div className='authentication-container'>
            <Link className='login' to="/login"><FontAwesomeIcon className='icon' icon={faRightFromBracket} size="sm" style={{color: "goldenrod"}} /> Log In</Link>
            <Link className='signup' to="/signup"><FontAwesomeIcon className='icon' icon={faUserPlus} size="sm" style={{color: "goldenrod"}} /> Sign Up</Link>
          </div> 
        )}
      </div>
      { user && <h4 className='yourTrips-title'>Your Wish List</h4> }
        <div className='itineraries-container'>
        {itineraries && itineraries.length > 0 ? (
          itineraries.map((itinerary) => {
            const countryCode = getCountryCode(itinerary.country);
            return (
              <div className='itinerary-item' key={itinerary._id}>
                <Link className='itinerary-link' to={`/itineraries/${itinerary._id}`}>
                  <ReactCountryFlag 
                    className='country-flag' 
                    countryCode={countryCode} 
                    svg 
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
          })
        ) : (
           user ? 
            (<p style={{textAlign: "center"}}>No itineraries found.<br /> Create your first trip!</p>
            ) : (
            <p style={{textAlign: "center"}}>Log In or Signup to continue</p>
          )
        )}
        </div>
    </div>
  );
}
