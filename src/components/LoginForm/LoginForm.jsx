import { useState } from 'react';
import * as usersService from '../../utilities/users-service';
import styles from './LoginForm.module.css'

export default function LoginForm({ setUser, setShowSignin }) {
    const [credentials, setCredentials] = useState({
      email: '',
      password: ''
    });
    const [error, setError] = useState('');

    function handleChange(evt) {
      setCredentials({ ...credentials, [evt.target.name]: evt.target.value });
      setError('');
    }

    async function handleSubmit(evt) {
      evt.preventDefault();
      try {
        const user = await usersService.login(credentials);
        setUser(user);
        // close the sign in div
        setShowSignin(false)
      } catch {
        setError('Log In Failed - Try Again');
      }
    }

    return (
      <div className={styles.Login}>
        <div className="form-container">
          <form autoComplete="off" onSubmit={handleSubmit}>
            <label>Email</label>
            <input type="text" name="email" value={credentials.email} onChange={handleChange} required />
            <label>Password</label>
            <input type="password" name="password" value={credentials.password} onChange={handleChange} required />
            <button className='btn main-btn' type="submit">LOG IN</button>
          </form>
        </div>
        <p className="error-message">&nbsp;{error}</p>
      </div>
    );
}