import React from 'react';

export const Header = () => {
  return (
    <header style={styles.header}>
      <h1 style={styles.title}>Let's Ticket</h1>
      <nav style={styles.nav}>
        <a href="/login" style={styles.link}>Login</a>
        <a href="/signup" style={styles.link}>Signup</a>
      </nav>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#333',
    color: '#fff',
  },
  title: {
    margin: 0,
    fontSize: '24px',
  },
  nav: {
    display: 'flex',
    gap: '20px',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '18px',
  },
};