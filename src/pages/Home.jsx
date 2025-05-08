import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 
import { getAllRides } from '../api/api';
import styles from '../styles/Home.module.css';
import arrowIcon from '../assets/arrow.png';
import carIcon from '../assets/car.png';
import NoRidesCard from '../components/NoRidesCard.jsx';

function Home() {
  const { user } = useContext(AuthContext); 
  const [rides, setRides] = useState([]);
  const [filters, setFilters] = useState({
    departure: '',
    destination: '',
    date: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllRides();
  }, []);

  const fetchAllRides = async () => {
    setLoading(true);
    try {
      const response = await getAllRides();
      setRides(response.data);
    } catch (error) {
      console.error('Error loading rides:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRides = async () => {
    setLoading(true);
    try {
      const trimmedFilters = {
        departure: filters.departure.trim(),
        destination: filters.destination.trim(),
        date: filters.date.trim(),
      };
      const response = await getAllRides(trimmedFilters);
      setRides(response.data);
    } catch (error) {
      console.error('Error loading rides:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('ru-RU', {
      day: 'numeric', 
      month: 'numeric', 
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
    if (!user) {
      navigate('/login');
    } else {
      navigate(`/ride/${rideId}`);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));
  };

  const applyFilters = () => {
    fetchRides();
  };

  const resetFilters = () => {
    setFilters({
      departure: '',
      destination: '',
      date: '',
    });
    fetchAllRides();
  };

  const filteredRides = rides.length > 0 ? rides.filter((ride) => ride.seatsCount > 0) : [];

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <input
          type="text"
          name="departure"
          placeholder="Filter by departure"
          value={filters.departure}
          onChange={handleFilterChange}
          className={styles.filterInput}
        />
        <input
          type="text"
          name="destination"
          placeholder="Filter by destination"
          value={filters.destination}
          onChange={handleFilterChange}
          className={styles.filterInput}
        />
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
          className={styles.filterInput}
        />
        <button onClick={applyFilters} className={styles.filterButton} disabled={loading}>
          {loading ? 'Loading...' : 'Apply Filters'}
        </button>
        <button onClick={resetFilters} className={styles.filterButton} disabled={loading}>
          Reset Filters
        </button>
      </div>
      <div className={styles.ridesGrid}>
        {filteredRides.length > 0 ? (
          filteredRides.map((ride) => (
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
          <NoRidesCard />
        )}
      </div>
    </div>
  );
}

export default Home;