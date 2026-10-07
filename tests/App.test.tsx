import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

  describe('with ?env=dev', () => {
    beforeEach(() => window.history.pushState({}, '', '/?env=dev'));
    afterEach(() => window.history.pushState({}, '', '/'));

    const draw = (container: HTMLElement) =>
      fireEvent.click(container.getElementsByTagName('svg')[0]);
    const setTitle = (value: string) =>
      fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value } });
    const mintButton = () => screen.getByRole('button', { name: /mint the aaarto/i });

    test('should disable the mint button with an empty canvas and no title', () => {
      render(<App />);
      expect(mintButton()).toBeDisabled();
    });

    test('should disable the mint button with a title but nothing drawn', () => {
      render(<App />);
      setTitle('My art');
      expect(mintButton()).toBeDisabled();
    });

    test('should disable the mint button with a drawing but no title', () => {
      const { container } = render(<App />);
      draw(container);
      expect(mintButton()).toBeDisabled();
    });

    test('should disable the mint button with a whitespace-only title', () => {
      const { container } = render(<App />);
      draw(container);
      setTitle('   ');
      expect(mintButton()).toBeDisabled();
    });

    test('should enable the mint button with a drawing and a title', () => {
      const { container } = render(<App />);
      draw(container);
      setTitle('My art');
      expect(mintButton()).toBeEnabled();
    });
  });

  test('should render ControlPanel component with initial props', () => {
    render(<App />);
    expect(screen.getByLabelText('Circle')).toBeChecked();
    expect(screen.getByLabelText('Size')).toHaveValue('70');
    expect(screen.getByLabelText('Color')).toHaveValue('#cccccc');
  });
});
