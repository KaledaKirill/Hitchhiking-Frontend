import { useState, useEffect } from 'react';
import styles from '../styles/EditRideModal.module.css';

function EditRideModal({ isOpen, onClose, ride, onUpdateSuccess, updateRide }) {
  const [formData, setFormData] = useState({
    car: ride?.car || '',
    seatsCount: ride?.seatsCount || 1,
    departure: ride?.departure || '',
    destination: ride?.destination || '',
    departureTime: ride?.departureTime || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (ride?.departureTime) {
      const date = new Date(ride.departureTime);
      const localTime = date.toLocaleString('sv-SE', {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }).slice(0, 19).replace(' ', 'T');
      setFormData((prev) => ({
        ...prev,
        departureTime: localTime,
      }));
    }
  }, [ride]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'seatsCount' ? parseInt(value, 10) || 1 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const date = new Date(formData.departureTime);
      date.setHours(date.getHours() + 3);
      const adjustedTime = date.toISOString().slice(0, 19);
      const rideData = {
        ...formData,
        departureTime: adjustedTime,
        id: ride?.id || '',
      };
      if (!rideData.id) throw new Error('Ride ID is missing');
      await updateRide(rideData.id, rideData);
      onUpdateSuccess();
      onClose();
    } catch (err) {
      setError('Failed to update ride. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.header}>Edit Ride</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
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
              value={formData.departureTime || ''}
              onChange={handleChange}
              required
            />
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditRideModal;