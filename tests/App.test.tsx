import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '@components/App';

// The Coinbase SDK ships ES modules, which Jest can't load without extra config
jest.mock('../src/coinbaseHelpers', () => ({ connectCoinbaseWallet: jest.fn() }));

describe('App', () => {

  test('should render expected text', () => {
    render(<App />);
    // With no query string the mint button reads "Minting is not available yet"
    expect(screen.queryAllByText(/aaarto/i).length).toBe(1);
  });

  test('should render an SVG tag', () => {
    const { container } = render(<App />);
    const a = container.getElementsByTagName('svg')[0];
    expect(a).toBeInTheDocument()
  });

  test('should disable the mint button with no query string', () => {
    window.history.pushState({}, '', '/');
    render(<App />);
    expect(screen.getByRole('button', { name: /minting is not available yet/i })).toBeDisabled();
  });

  test('should enable the mint button with ?env=dev', () => {
    window.history.pushState({}, '', '/?env=dev');
    render(<App />);
    expect(screen.getByRole('button', { name: /mint the aaarto/i })).toBeEnabled();
    window.history.pushState({}, '', '/');
  });

  test('should render ControlPanel component with initial props', () => {
    render(<App />);
    expect(screen.getByLabelText('Circle')).toBeChecked();
    expect(screen.getByLabelText('Size')).toHaveValue('70');
    expect(screen.getByLabelText('Color')).toHaveValue('#cccccc');
  });
});
