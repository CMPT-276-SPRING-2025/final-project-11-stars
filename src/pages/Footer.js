import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="quiz-footer">
      <div className="footer-content">
        <p>🌵 Made with 💚 by Bud-E & Team</p>
        <div className="footer-links">
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy</a>
        </div>
        <p className="footer-note">© {new Date().getFullYear()} 11Stars. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
