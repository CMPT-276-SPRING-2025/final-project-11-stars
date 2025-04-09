// HelpButton.test.js
// Tests HelpButton UI, renders icon, shows/hides help popup on click.


import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import HelpButton from "../pages/HelpButton";

describe("HelpButton", () => {
  test("renders help button with icon", () => {
    render(<HelpButton />);
    const helpButton = screen.getByRole("button");
    expect(helpButton).toBeInTheDocument();
    expect(screen.getByAltText(/Help/i)).toBeInTheDocument();
  });

  test("shows help popup on click", () => {
    render(<HelpButton />);
    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText(/How to Use BrainGoated/i)).toBeInTheDocument();
    expect(screen.getByText(/Choose a quiz category/i)).toBeInTheDocument();
    expect(screen.getByText(/Got it!/i)).toBeInTheDocument();
  });

  test("closes help popup when 'Got it!' is clicked", () => {
    render(<HelpButton />);
    fireEvent.click(screen.getByRole("button")); 

    const closeBtn = screen.getByText(/Got it!/i);
    fireEvent.click(closeBtn);

    expect(screen.queryByText(/How to Use BrainGoated/i)).not.toBeInTheDocument();
  });
});
