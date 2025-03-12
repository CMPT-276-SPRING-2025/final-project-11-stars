// src/components/Home.js
import React from "react";
import { ReactComponent as Logo } from '/Users/alishajesani/Desktop/final-project-11-stars/public/bud-e.png';  // ✅ Correct Path

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="title">BrainGoated</h1>
      <Logo className="logo" />
      <p className="tagline">Water your curiosity, Watch it grow!</p>
    </div>
  );
};

export default Home;
