import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

import * as authService from '../../services/authService';
import './NavBar.css';

export default function NavBar({ user, setUser, toggleSidebar }) {
  function handleLogOut() {
    authService.logOut();
    setUser(null);
  }

  return (
    <nav className="NavBar">
      <div className='navigation-left-side'>
        <button className="hamburger-button" onClick={toggleSidebar}>&#9776;</button>
        <Link className='logo' to="/"><h1>Travel Genie</h1></Link>
      </div>
      {user ? (
        <div className='navigation-right-side'>
          <Link to="/posts">Post List</Link>
          &nbsp; | &nbsp;
          <Link to="/posts/new">New Post</Link>
          &nbsp; | &nbsp;
          <Link to="" onClick={handleLogOut}>
            Log Out
          </Link>
          &nbsp;&nbsp;
          <span>Welcome, {user.name}</span>
        </div>
      ) : (
        <div className='navigation-right-side'>
          <Link to="/login"><FontAwesomeIcon className='icon' icon={faRightFromBracket} size="lg" style={{color: "goldenrod"}} /> Log In</Link>
          &nbsp; | &nbsp;
          <Link to="/signup"><FontAwesomeIcon className='icon' icon={faUserPlus} size="lg" style={{color: "goldenrod"}} /> Sign Up</Link>
        </div>
      )}
    </nav>
  );
}
