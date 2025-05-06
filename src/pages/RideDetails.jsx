// src/pages/RideDetails.jsx
import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getRideById } from '../api/api';
import styles from '../styles/RideDetails.module.css';

function RideDetails() {
  const { user } = useContext(AuthContext);
  const { rideId } = useParams();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const response = await getRideById(rideId);
        setRide(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load ride details.', err);
        setLoading(false);
      }
    };
    fetchRide();
  }, [rideId]);

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!ride) return <p className={styles.error}>Ride not found.</p>;

  const isDriver = user && user.id === ride.driver.id;
  const isPassenger = user && ride.passengers && ride.passengers.some((p) => p.id === user.id);
  const canJoin = user && !isDriver && !isPassenger && ride.seatsCount > (ride.passengers?.length || 0);

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        {/* Левая колонка: Детали поездки и кнопки */}
        <div className={styles.leftColumn}>
          <div className={styles.rideDetails}>
            <div className={styles.route}>
              <h2>{ride.departure} → {ride.destination}</h2>
            </div>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Date and Time:</span>
                <span>{formatDateTime(ride.departureTime)}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Car:</span>
                <span>{ride.car}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Available Seats:</span>
                <span>{ride.seatsCount}</span>
              </div>
            </div>
            {user && (
              <div className={styles.actionButtons}>
                {isDriver ? (
                  <>
                    <button className={styles.editButton}>Edit Ride</button>
                    <button className={styles.deleteButton}>Delete Ride</button>
                  </>
                ) : isPassenger ? (
                  <button className={styles.leaveButton}>Leave Ride</button>
                ) : canJoin ? (
                  <button className={styles.joinButton}>Join Ride</button>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* Правая колонка: Водитель и пассажиры */}
        <div className={styles.rightColumn}>
          <h3 className={styles.sectionTitle}>Driver</h3>
          <div className={styles.driverCard}>
            <h4 className={styles.cardTitle}>
              <Link to={`/profile/${ride.driver.id}`} className={styles.link}>
                {ride.driver.name || 'Unknown Driver'}
              </Link>
            </h4>
            <p className={styles.cardInfo}>
              <span className={styles.infoLabel}>Email:</span> {ride.driver.email || 'Not provided'}
            </p>
            <p className={styles.cardInfo}>
              <span className={styles.infoLabel}>Phone:</span> {ride.driver.phone || 'Not provided'}
            </p>
          </div>

          <h3 className={styles.sectionTitle}>Passengers</h3>
          {ride.passengers && ride.passengers.length > 0 ? (
            <div className={styles.passengerGrid}>
              {ride.passengers.map((passenger) => (
                <div key={passenger.id} className={styles.passengerCard}>
                  <h4 className={styles.cardTitle}>
                    <Link to={`/profile/${passenger.id}`} className={styles.link}>
                      {passenger.name || 'Unknown Passenger'}
                    </Link>
                  </h4>
                  <p className={styles.cardInfo}>
                    <span className={styles.infoLabel}>Email:</span> {passenger.email || 'Not provided'}
                  </p>
                  <p className={styles.cardInfo}>
                    <span className={styles.infoLabel}>Phone:</span> {ride.driver.phone || 'Not provided'}
                </p>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.noPassengers}>No passengers yet.</p>
          )}
        </div>
      </div>
      {!user && (
        <p className={styles.loginPrompt}>
          Please <Link to="/login" className={styles.link}>log in</Link> to join this ride.
        </p>
      )}
    </div>
  );
}

export default RideDetails;