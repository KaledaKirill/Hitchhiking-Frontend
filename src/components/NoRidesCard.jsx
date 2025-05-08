import React from 'react';
import styles from '../styles/NoRidesCard.module.css';
import noRidesImage from '../assets/crossed_car.png';

const NoRidesCard = () => {
  return (
    <div className={styles.noRidesCard}>
      <img src={noRidesImage} alt="No rides found" className={styles.noRidesImage} />
      <p className={styles.noRidesText}>No rides found</p>
    </div>
  );
};

export default NoRidesCard;