import React from "react";
import { render, screen } from "@testing-library/react";
import HomePage from "../pages/Homepage";

jest.mock("../pages/Quizcategories", () => () => (
  <div>Mocked QuizCategory</div>
));

describe("HomePage", () => {
  test("renders main heading", () => {
    render(<HomePage />);
    const heading = screen.getByText(/BrainGoated/i);
    expect(heading).toBeInTheDocument();
  });

  test("renders Bud-E iframe", () => {
    render(<HomePage />);
    const iframe = screen.getByTitle(/Bud-E Animation/i);
    expect(iframe).toBeInTheDocument();
  });

  test("renders tagline", () => {
    render(<HomePage />);
    const tagline = screen.getByText(/Water your curiosity, Watch it grow!/i);
    expect(tagline).toBeInTheDocument();
  });

  test("renders QuizCategory component", () => {
    render(<HomePage />);
    const mockComponent = screen.getByText(/Mocked QuizCategory/i);
    expect(mockComponent).toBeInTheDocument();
  });
});