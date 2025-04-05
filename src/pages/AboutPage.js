import React from 'react';
import { Link } from 'react-router-dom';
import './StaticPage.css';

const AboutPage = () => (
  <div className="static-page">
    <div className="static-page-content">
      <h2>🌵 About Us</h2>
      <p>
        Welcome to <strong>BrainGoated</strong>, the playful learning space where curiosity grows!
      </p>
      <p>
        We are a team of computer science students from SFU and trivia lovers, dedicated to creating a fun and
        engaging platform for kids and trivia buffs alike. Our mission is to make learning exciting and
        interactive, turning every question into an <strong>adventure</strong>.
      </p>
      <p>
        With <strong>Bud-E</strong>, the brainy robot cheering you on, we turn trivia into an adventure!
      </p>
      <p>
        Whether you're playing for fun, exploring new facts, or challenging yourself,
        BrainGoated is here to make every question count. ✨
      </p>
      <Link to="/" className="back-home-btn">← Back to Home</Link>
    </div>
    <img src="/bud-e.png" alt="Bud-E mascot" className="static-bude" />
  </div>
);

export default AboutPage;
