import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="main-footer">
      <p>&copy; 2024 TicketingService. All Rights Reserved.</p>
      <div className="footer-links">
        <a href="/terms">Terms of Service</a>
        <a href="/privacy">Privacy Policy</a>
        <a href="/help">Customer Support</a>
      </div>
    </footer>
  );
};

export default Footer;