import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import '../LogInPage/LogInPage.css'
import * as authService from '../../services/authService';

export default function LogInPage({ setUser }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      const user = await authService.logIn(formData);
      setUser(user);
    } catch (err) {
      setErrorMsg('Log In Failed - Try Again');
    }
  }

  function handleChange(evt) {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
    setErrorMsg('');
  }

  return (
    <div className='main-log-in-container'>
      <h2>Log In</h2>
      <form id='log-in-form' autoComplete="off" onSubmit={handleSubmit}>
      <fieldset>
      <legend><em>YOUR CREDENTIALS:</em></legend>
        <div class="inputBox">
          <input type="email" name="email" value={formData.email}
            onChange={handleChange}
            required
          />
          <label>Email</label>
        </div>

          <div className='inputBox'>
            <input type="password" name="password"value={formData.password}
              onChange={handleChange}
              required
            />
            <label>Password</label>
          </div>
        </fieldset>
        <button type="submit">LOG IN</button>
      <Link style={{textAlign: "center"}} to="/signup">Not Registered? &nbsp; <FontAwesomeIcon className='icon' icon={faUserPlus} size="lg" style={{color: "goldenrod"}} /> Sign Up</Link>
      </form>
      <p className="error-message">&nbsp;{errorMsg}</p>
    </div>
  );
}
