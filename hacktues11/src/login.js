import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import './App.css';
import { useAuth } from "./AuthContext";

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const { login, signup } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    login(email, password);

  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!firstName || !lastName) {
      setError('Please enter your first name and last name.');
      return;
    }

    signup(firstName, lastName, email, password);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    return regex.test(email);
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setFirstName('');
    setLastName('');
  };

  return (
    <div className="login-page">
      <h1>{isSignUp ? 'Създаване на акаунт' : 'Влизане в акаунт'}</h1>
      <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
      {isSignUp && (
          <>
            <div>
              {/* <label>Първо име:</label> */}
              <input
                type="text"
                placeholder='Първо име'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              {/* <label>Фамилия:</label> */}
              <input
                type="text"
                placeholder='Фамилия'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </>
        )}
        <div>
          {/* <label>E-mail:</label> */}
          <input
            type="email"
            placeholder='Имейл'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          {/* <label>Парола:</label> */}
          <input
            type="password"
            placeholder='Парола'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">{isSignUp ? 'Създай акаунт' : 'Влез в акаунта си'}</button>
        <p>{isSignUp ? 'Вече имате акаунт?' : 'Нямате акаунт?'} <a className='createacountlink' onClick={toggleForm}>{isSignUp ? 'Влизане в акаунт' : 'Създаване на нов акаунт'}</a></p>
        {/* <button type="button" onClick={toggleForm}>{isSignUp ? 'Влизане в акаунт' : 'Създаване на нов акаунт'}</button> */}
      </form>
    </div>
  );
};

export default App;