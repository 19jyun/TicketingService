import React from 'react';
import styles from '../styles/components/Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles['main-footer']}>
      <p>&copy; 2024 TicketingService. All Rights Reserved.</p>
      <div className={styles['footer-links']}>
        <a href="/terms">Terms of Service</a>
        <a href="/privacy">Privacy Policy</a>
        <a href="/help">Customer Support</a>
      </div>
    </footer>
  );
};

export default Footer;