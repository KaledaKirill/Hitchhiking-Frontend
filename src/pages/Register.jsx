// src/pages/Register.jsx
import { useState, useContext } from 'react';
import { registerUser } from '../api/api';
import styles from '../styles/Auth.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
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
      const response = await registerUser(formData);
      const token = response.data.token; // Получаем токен из ответа
      login(token); // Сохраняем токен через контекст
      setSuccess('Registration successful! Redirecting to profile...');
      setError('');
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err) {
      if (err.response?.data && typeof err.response.data === 'object' && !err.response.data.message) {
        const errorMessages = Object.entries(err.response.data)
          .map(([field, message]) => `${field}: ${message}`)
          .join(', ');
        setError(errorMessages || 'Registration failed. Please try again.');
      } else {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.response?.data?.details ||
          err.message ||
          'Registration failed. Please try again.';
        setError(errorMessage);
      }
      setSuccess('');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Register</h2>
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={`${styles.input} ${error ? styles.error : ''}`}
          />
        </div>
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
            minLength={6}
            className={`${styles.input} ${error ? styles.error : ''}`}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`${styles.input} ${error ? styles.error : ''}`}
          />
        </div>
        <button type="submit" className={styles.button}>
          Register
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;