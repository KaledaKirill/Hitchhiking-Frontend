import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getRideById, deleteRide, addPassenger, removePassenger, updateRide } from '../api/api';
import Modal from '../components/Modal';
import EditRideModal from '../components/EditRideModal';
import styles from '../styles/RideDetails.module.css';

function RideDetails() {
  const { user } = useContext(AuthContext);
  const { rideId } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const openModal = (action) => {
    if (action === 'delete' || action === 'leave') {
      setModalAction(action);
      setIsModalOpen(true);
    }
  };

  const confirmAction = async () => {
    try {
      if (modalAction === 'delete') {
        await deleteRide(rideId);
        navigate('/profile');
      } else if (modalAction === 'leave') {
        await removePassenger(rideId, user.id);
        const response = await getRideById(rideId);
        setRide(response.data);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(`Failed to ${modalAction} ride. Please try again.`);
      console.error(err);
      setIsModalOpen(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleJoin = async () => {
    try {
      await addPassenger(rideId, user.id);
      const response = await getRideById(rideId);
      setRide(response.data);
    } catch (err) {
      setError('Failed to join ride. Please try again.');
      console.error(err);
    }
  };

  const handleEditSuccess = async () => {
    try {
      const response = await getRideById(rideId);
      setRide(response.data);
    } catch (err) {
      setError('Failed to refresh ride details after update.', err);
      console.error(err);
    }
  };

  const userId = user ? String(user.id) : null;
  const isDriver = userId && ride && ride.driver && String(ride.driver.id) === userId;
  const isPassenger = userId && ride && ride.passengers && ride.passengers.some((p) => String(p.id) === userId);
  const canJoin = userId && !isDriver && !isPassenger && ride && ride.seatsCount > 0;

  console.log('User:', user);
  console.log('Ride:', ride);
  console.log('isDriver:', isDriver);
  console.log('isPassenger:', isPassenger);
  console.log('canJoin:', canJoin);

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!ride) return <p className={styles.error}>Ride not found.</p>;

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
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
                    <button className={styles.editButton} onClick={() => setIsEditModalOpen(true)}>
                      Edit Ride
                    </button>
                    <button className={styles.deleteButton} onClick={() => openModal('delete')}>
                      Delete Ride
                    </button>
                  </>
                ) : isPassenger ? (
                  <button className={styles.leaveButton} onClick={() => openModal('leave')}>
                    Leave Ride
                  </button>
                ) : canJoin ? (
                  <button className={styles.joinButton} onClick={handleJoin}>
                    Join Ride
                  </button>
                ) : !isDriver && !isPassenger && !canJoin ? (
                  <p className={styles.noSeatsMessage}>No available seats.</p>
                ) : null}
              </div>
            )}
          </div>
        </div>

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

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmAction}
        title={
          modalAction === 'delete'
            ? 'Confirm Deletion'
            : 'Confirm Leave'
        }
        message={
          modalAction === 'delete'
            ? 'Are you sure you want to delete this ride? This action cannot be undone.'
            : 'Are you sure you want to leave this ride?'
        }
      />
      <EditRideModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        ride={ride}
        onUpdateSuccess={handleEditSuccess}
        updateRide={updateRide}
      />
    </div>
  );
}

export default RideDetails;