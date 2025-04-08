// Footer.js
// This component renders the footer section for the BrainGoated site.
// It includes navigation links, copyright info,
// and the Bud-E mascot icon.

import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="quiz-footer">
      <div className="footer-inner">
        {/* Left: Text Content */}
        <div className="footer-content">
          <p>From seed to screen 🌱 — by the BrainGoated Team</p>
          <div className="footer-links">
            <a href="/about">About Us</a>
            <a href="/contact">Contact Us</a>
          </div>
          <p className="footer-note">© {new Date().getFullYear()} BrainGoated. All rights reserved.</p>
        </div>
        <img src="/bud-e.png" 
          alt="A friendly robot mascot named Bud-E with a sprout growing from its head, symbolizing growth and technology. 
          It has a round face, a smiling expression, and a plant-like element on top, reflecting the growth theme of the website." 
          className="bude-footer-icon-inline" 
        />
      </div>
    </footer>
  );
};

export default Footer;
