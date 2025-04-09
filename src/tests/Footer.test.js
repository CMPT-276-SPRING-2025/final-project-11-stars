// Footer.test.js
// It checks for footer text, important links (About Us, Contact Us), current year copyright,
// and the Bud-E mascot image.

import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "../pages/Footer"; 

describe("Footer", () => {
  test("renders footer text and links", () => {
    render(<Footer />);

    expect(
      screen.getByText(/From seed to screen 🌱 — by the BrainGoated Team/i)
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /About Us/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Contact Us/i })).toBeInTheDocument();

    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(`© ${currentYear} BrainGoated. All rights reserved.`)
    ).toBeInTheDocument();

    expect(screen.getByAltText(/A friendly robot mascot named Bud-E with a sprout growing from its head, symbolizing growth and technology. It has a round face, a smiling expression, and a plant-like element on top, reflecting the growth theme of the website./i)).toBeInTheDocument();
  });
});
