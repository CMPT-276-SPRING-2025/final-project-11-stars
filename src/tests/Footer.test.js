import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "../pages/Footer"; 

describe("Footer", () => {
  test("renders footer text and links", () => {
    render(<Footer />);

    expect(
      screen.getByText(/From seed to screen — by the BrainGoated Team/i)
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /About Us/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Contact Us/i })).toBeInTheDocument();

    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(`© ${currentYear} BrainGoated. All rights reserved.`)
    ).toBeInTheDocument();

    expect(screen.getByAltText(/Bud-E mascot/i)).toBeInTheDocument();
  });
});
