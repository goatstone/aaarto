import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../src/App';
import '@testing-library/jest-dom';

// Test suite for the App component
describe('App', () => {
  // Test to check if the Header component is rendered
  test('renders Header component', () => {
    render(<App />);
    expect(screen.getByText(/aaarto/i)).toBeInTheDocument();
  });

  // Test to check if the Canvas component is rendered with initial props
  test('renders Canvas component with initial props', () => {
    render(<App />);
    const canvasElement = screen.getByTestId('canvas');
    expect(canvasElement).toHaveAttribute('data-shape', 'circle');
    expect(canvasElement).toHaveAttribute('data-size', '70');
    expect(canvasElement).toHaveAttribute('data-color', '#cccccc');
  });

  // Test to check if the ControlPanel component is rendered with initial props
  test('renders ControlPanel component with initial props', () => {
    render(<App />);
    expect(screen.getByLabelText('Circle')).toBeChecked();
    expect(screen.getByLabelText('Size')).toHaveValue('70');
    expect(screen.getByLabelText('Color')).toHaveValue('#cccccc');
  });
});