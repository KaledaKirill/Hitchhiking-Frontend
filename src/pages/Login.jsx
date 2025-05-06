// src/pages/Login.jsx
import { useState, useContext } from 'react';
import { loginUser } from '../api/api';
import styles from '../styles/Auth.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      const token = response.data.token; // Получаем токен из ответа
      login(token); // Сохраняем токен через контекст
      setSuccess('Login successful! Redirecting to profile...');
      setError('');
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err) {
      if (err.response?.data && typeof err.response.data === 'object' && !err.response.data.message) {
        const errorMessages = Object.entries(err.response.data)
          .map(([field, message]) => `${field}: ${message}`)
          .join(', ');
        setError(errorMessages || 'Login failed. Please check your credentials.');
      } else {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.response?.data?.details ||
          err.message ||
          'Login failed. Please check your credentials.';
        setError(errorMessage);
      }
      setSuccess('');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Login</h2>
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={`${styles.input} ${error ? styles.error : ''}`}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className={`${styles.input} ${error ? styles.error : ''}`}
          />
        </div>
        <button type="submit" className={styles.button}>
          Login
        </button>
      </form>
      <p>
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;