import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { getCurrentUser, getRidesByDriverId, getRidesByPassengerId, removePassenger, deleteRide, updateRide, getRideById } from '../api/api';
import Modal from '../components/Modal';
import EditRideModal from '../components/EditRideModal';
import styles from '../styles/Profile.module.css';
import profileIcon from '../assets/profile.png';

function Profile() {
  const { user, token } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [driverTrips, setDriverTrips] = useState([]);
  const [passengerTrips, setPassengerTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRideId, setSelectedRideId] = useState(null);
  const [modalAction, setModalAction] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userResponse = await getCurrentUser();
        setUserData(userResponse.data);

        const userId = userResponse.data.id;

        const driverTripsResponse = await getRidesByDriverId(userId);
        setDriverTrips(driverTripsResponse.data);

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

  const handleViewDetails = (rideId) => {
    if (!user) {
      navigate('/register');
    } else {
      navigate(`/ride/${rideId}`);
    }
  };

  const openModal = (rideId, action) => {
    setSelectedRideId(rideId);
    setModalAction(action);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRideId(null);
    setModalAction('');
  };

  const handleLeaveRide = async () => {
    if (!user) {
      navigate('/register');
      return;
    }

    try {
      setLoading(true);
      await removePassenger(selectedRideId, user.id);
      const passengerTripsResponse = await getRidesByPassengerId(user.id);
      setPassengerTrips(passengerTripsResponse.data);
      setError(null);
    } catch (err) {
      setError('Failed to leave the ride. Please try again.', err);
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  const handleDeleteRide = async () => {
    if (!user) {
      navigate('/register');
      return;
    }

    try {
      setLoading(true);
      await deleteRide(selectedRideId);
      const userId = userData.id;
      const driverTripsResponse = await getRidesByDriverId(userId);
      setDriverTrips(driverTripsResponse.data);
      setError(null);
    } catch (err) {
      setError('Failed to delete the ride. Please try again.', err);
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  const handleModifyRide = async (ride) => {
    if (!user || !ride || !ride.id) {
      setError('Invalid ride data for modification.');
      return;
    }

    try {
      setLoading(true);
      const rideResponse = await getRideById(ride.id); 
      setSelectedRide(rideResponse.data);
      setIsEditModalOpen(true);
    } catch (err) {
      setError('Failed to load ride details for modification.', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSuccess = async () => {
    try {
      setLoading(true);
      const userId = userData.id;
      const driverTripsResponse = await getRidesByDriverId(userId);
      setDriverTrips(driverTripsResponse.data);
      setError(null);
    } catch (err) {
      setError('Failed to refresh rides after update.', err);
    } finally {
      setLoading(false);
      setIsEditModalOpen(false);
      setSelectedRide(null);
    }
  };

  const handleConfirmAction = () => {
    if (modalAction === 'leave') {
      handleLeaveRide();
    } else if (modalAction === 'delete') {
      handleDeleteRide();
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
                  <h4>
                    {trip.departure} → {trip.destination}
                  </h4>
                  {formatDateTime(trip.departureTime)} <br />
                </p>
                <div className={styles.tripButtons}>
                  <button
                    className={styles.modifyButton}
                    onClick={() => handleModifyRide(trip)}
                  >
                    Modify
                  </button>
                  <button
                    className={styles.detailsButton}
                    onClick={() => handleViewDetails(trip.id)}
                  >
                    Details
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => openModal(trip.id, 'delete')}
                  >
                    Delete
                  </button>
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
                  <h4>
                    {trip.departure} → {trip.destination}
                  </h4>
                  {formatDateTime(trip.departureTime)} <br />
                </p>
                <div className={styles.tripButtons}>
                  <button
                    className={styles.detailsButton}
                    onClick={() => handleViewDetails(trip.id)}
                  >
                    Details
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => openModal(trip.id, 'leave')}
                  >
                    Leave
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No trips as a passenger.</p>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirmAction}
        title={modalAction === 'delete' ? 'Confirm Deletion' : 'Confirm Leave'}
        message={
          modalAction === 'delete'
            ? 'Are you sure you want to delete this ride? This action cannot be undone.'
            : 'Are you sure you want to leave this ride?'
        }
      />

      <EditRideModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedRide(null);
        }}
        ride={selectedRide || { id: '', car: '', seatsCount: 1, departure: '', destination: '', departureTime: '' }}
        onUpdateSuccess={handleEditSuccess}
        updateRide={updateRide}
      />
    </div>
  );
}

export default Profile;