// src/pages/CreateRide.jsx
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { createRide } from '../api/api';
import styles from '../styles/CreateRide.module.css';

function CreateRide() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    departure: '',
    destination: '',
    departureTime: '',
    car: '',
    seatsCount: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'seatsCount' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!user || !user.id) {
      setError('User not authenticated or ID is missing.');
      setLoading(false);
      return;
    }

    try {
      const rideData = {
        ...formData,
        driverId: user.id, // Добавляем driverId из user
      };
      await createRide(rideData);
      navigate('/profile');
    } catch (err) {
      setError('Failed to create ride. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className={styles.container}>
      <h1>Create a New Ride</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="departure">Departure</label>
          <input
            type="text"
            id="departure"
            name="departure"
            value={formData.departure}
            onChange={handleChange}
            required
            placeholder="Enter departure location"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="destination">Destination</label>
          <input
            type="text"
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            required
            placeholder="Enter destination"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="departureTime">Departure Time</label>
          <input
            type="datetime-local"
            id="departureTime"
            name="departureTime"
            value={formData.departureTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="car">Car</label>
          <input
            type="text"
            id="car"
            name="car"
            value={formData.car}
            onChange={handleChange}
            required
            placeholder="Enter car model"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="seatsCount">Seats Available</label>
          <input
            type="number"
            id="seatsCount"
            name="seatsCount"
            value={formData.seatsCount}
            onChange={handleChange}
            min="1"
            required
          />
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Creating...' : 'Create Ride'}
        </button>
      </form>
    </div>
  );
}

export default CreateRide;