// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllRides } from '../api/api';
import styles from '../styles/Home.module.css';
import arrowIcon from '../assets/arrow.png';
import carIcon from '../assets/car.png';

function Home() {
  const [rides, setRides] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await getAllRides();
        setRides(response.data);
      } catch (error) {
        console.error('Error loading rides:', error);
      }
    };
    fetchRides();
  }, []);

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPassengersCount = (ride) => {
    return ride.passengers ? ride.passengers.length : 0;
  };

  const handleNavigateHome = () => {
    navigate('/');
  };

  const handleViewDetails = (rideId) => {
    navigate(`/ride/${rideId}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.ridesGrid}>
        {rides.length > 0 ? (
          rides.map((ride) => (
            <div key={ride.id} className={styles.rideCard}>
              <div>
                <h3 onClick={handleNavigateHome} style={{ cursor: 'pointer' }}>
                  <img
                    src={carIcon}
                    alt="Car"
                    className={styles.carIcon}
                    onClick={handleNavigateHome}
                    style={{ cursor: 'pointer' }}
                  />
                  {ride.departure}
                  <img src={arrowIcon} alt="Arrow" className={styles.arrowIcon} />
                  {ride.destination}
                </h3>
                <p>Date and Time: {formatDateTime(ride.departureTime)}</p>
                <p>Driver: {ride.driver.name}</p>
                <p>Passengers count: {getPassengersCount(ride)}</p>
                <p>Available seats: {ride.seatsCount}</p>
              </div>
              <div className={styles.buttons}>
                <button className={styles.addButton}>Add Ride</button>
                <button
                  className={styles.detailsButton}
                  onClick={() => handleViewDetails(ride.id)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No rides found</p>
        )}
      </div>
    </div>
  );
}

export default Home;