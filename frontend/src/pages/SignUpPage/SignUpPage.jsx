import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import '../SignUpPage/SignUpPage.css'
import * as authService from '../../services/authService';

export default function SignUpPage({ setUser }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      const user = await authService.signUp(formData);
      setUser(user);
    } catch (err) {
      // An error occurred
      console.log(err);
      setErrorMsg('Sign Up Failed - Try Again');
    }
  }

  function handleChange(evt) {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
    setErrorMsg('');
  }

  const disable = formData.password !== formData.confirm;

  return (
    <div className='main-log-in-container'>
      <h2>Sign Up!</h2>
      <form autoComplete="off" onSubmit={handleSubmit} id='sign-up-form'>
      <fieldset>
      <legend><em>YOUR CREDENTIALS:</em></legend>
        <div className='inputBox'>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            />
          <label>Name</label>
        </div>
        <div className='inputBox'>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            />
          <label>Email</label>
        </div>
        </fieldset>

        <fieldset>
        <legend><em>YOUR PASSWORD:</em></legend>
        <div className='inputBox'>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <label>Password</label>
        </div>
        
        <div className='inputBox'>
        <input
          type="password"
          name="confirm"
          value={formData.confirm}
          onChange={handleChange}
          required
        />
        <label>Confirm</label>
        </div>
        </fieldset>
        <button type="submit" disabled={disable}>
          SIGN UP
        </button>
        <Link style={{textAlign: "center"}} to="/login">Already registered? &nbsp;<FontAwesomeIcon className='icon' icon={faRightFromBracket} size="lg" style={{color: "goldenrod"}} /> Log In</Link>
      </form>
      <p className="error-message">&nbsp;{errorMsg}</p>
    </div>
  );
}
