import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { getCurrentUser, getRidesByDriverId, getRidesByPassengerId } from '../api/api';
import styles from '../styles/Profile.module.css';
import profileIcon from '../assets/profile.png';

function Profile() {
  const { user, token } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [driverTrips, setDriverTrips] = useState([]);
  const [passengerTrips, setPassengerTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Получаем данные пользователя
        const userResponse = await getCurrentUser();
        setUserData(userResponse.data);

        // Получаем ID пользователя из токена или контекста
        const userId = userResponse.data.id;

        // Получаем поездки как водитель
        const driverTripsResponse = await getRidesByDriverId(userId);
        setDriverTrips(driverTripsResponse.data);

        // Получаем поездки как пассажир
        const passengerTripsResponse = await getRidesByPassengerId(userId);
        setPassengerTrips(passengerTripsResponse.data);
      } catch (err) {
        setError('Failed to load profile data. Please try again.', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfileData();
  }, [token]);

  if (!user) {
    return <Navigate to="/" />;
  }

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.profileHeader}>
        <img src={profileIcon} alt="Profile" className={styles.profileIcon} />
        <div>
          <h2>{userData?.name || 'User Name'}</h2>
          <p>Email: {userData?.email}</p>
          <p>Phone: {userData?.phone}</p>
        </div>
      </div>
      <div className={styles.tripsContainer}>
        <div className={styles.tripsSection}>
          <h3>Trips as a Driver</h3>
          {driverTrips.length > 0 ? (
            driverTrips.map((trip) => (
              <div key={trip.id} className={styles.tripCard}>
                <p>
                  {trip.departure} to {trip.destination} <br />
                  Departure: {new Date(trip.departureTime).toLocaleString()} <br />
                  Car: {trip.car} | Seats: {trip.seatsCount}
                </p>
                <div className={styles.tripButtons}>
                  <button className={styles.modifyButton}>Modify</button>
                  <button className={styles.deleteButton}>Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p>No trips as a driver.</p>
          )}
        </div>
        <div className={styles.tripsSection}>
          <h3>Trips as a Passenger</h3>
          {passengerTrips.length > 0 ? (
            passengerTrips.map((trip) => (
              <div key={trip.id} className={styles.tripCard}>
                <p>
                  Trip with {trip.driver.name} <br />
                  From {trip.departure} to {trip.destination} <br />
                  Car: {trip.car}
                </p>
                <div className={styles.tripButtons}>
                  <button className={styles.deleteButton}>Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p>No trips as a passenger.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;