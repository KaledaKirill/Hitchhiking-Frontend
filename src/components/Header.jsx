// src/components/Header.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/Header.module.css';
import logoIcon from '../assets/logo.png';
import profileIcon from '../assets/profile.png';

function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.navContent}>
        <div className={styles.logo}>
          <Link to="/" className={styles.logoLink}>
            <img src={logoIcon} alt="Hitchhiking service" className={styles.icon} />
            <span>Hitchhiking service</span>
          </Link>
        </div>
        <div className={styles.navLinksContainer}>
          <div className={styles.navLinks}>
            <Link to="/" className={styles.link}>
              Home
            </Link>
            <Link to="/create_ride" className={styles.link}>
              Create ride
            </Link>
          </div>
        </div>
        <div className={styles.profileContainer}>
          <img
            src={profileIcon}
            alt="Profile"
            className={styles.profileIcon}
            onClick={toggleMenu}
          />
          {isMenuOpen && (
            <div className={styles.dropdownMenu}>
              {user ? (
                <>
                  <Link to="/profile" className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>
                    Profile
                  </Link>
                  <button className={styles.dropdownItem} onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/register" className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>
                    Register
                  </Link>
                  <Link to="/login" className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;