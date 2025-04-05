import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="quiz-footer">
      <div className="footer-inner">
        {/* Left: Text Content */}
        <div className="footer-content">
          <p>From seed to screen — by the BrainGoated Team</p>
          <div className="footer-links">
            <a href="/about">About Us</a>
            <a href="/contact">Contact Us</a>
          </div>
          <p className="footer-note">© {new Date().getFullYear()} BrainGoated. All rights reserved.</p>
        </div>
        <img src="/bud-e.png" alt="Bud-E mascot" className="bude-footer-icon-inline" />
      </div>
    </footer>
  );
};

export default Footer;
