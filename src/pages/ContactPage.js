// ContactPage.js
// This component displays the Contact Us page for BrainGoated.
// It includes contact information, a message of encouragement, 
// and a link to return to the homepage.

import React from 'react';
import { Link } from 'react-router-dom';
import './StaticPage.css';

const ContactPage = () => (
  <div className="static-page">
    <div className="static-page-content">
      <h2>📬 Contact Us</h2>
      <p>
        Have feedback, ideas, or just want to say hello?
      </p>
      <p>
        Reach out to our friendly team at:
        <br />
        <a href="mailto:support@braingoated.com">support@braingoated.com</a>
      </p>
      <p>
        We're always here to help you keep learning and growing! 🌱
      </p>
      <Link to="/" className="back-home-btn">← Back to Home</Link>
    </div>
    <img src="/bud-e.png" 
      alt="A friendly robot mascot named Bud-E with a sprout growing from its head, symbolizing growth and technology. 
      It has a round face, a smiling expression, and a plant-like element on top, reflecting the growth theme of the website."  
      className="static-bude" 
    />
  </div>
);

export default ContactPage;
