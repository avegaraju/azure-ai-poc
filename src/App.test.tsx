import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Azure AI Search POC heading", () => {
  render(<App />);
  const headingElement = screen.getByText(/Azure AI Search POC/i);
  expect(headingElement).toBeInTheDocument();
});
