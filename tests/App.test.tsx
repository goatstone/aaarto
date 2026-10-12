import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '@components/App';
import { RABBY_DOWNLOAD_URL } from '../src/rabbyHelpers';


// Rabby is "not installed" unless a test says otherwise
jest.mock('../src/rabbyHelpers', () => ({
  ...jest.requireActual('../src/rabbyHelpers'),
  connectRabbyWallet: jest.fn(() => Promise.reject(new Error('not_installed'))),
}));

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

    test('should mark the mint button aria-disabled with an empty canvas and no title', () => {
      render(<App />);
      expect(mintButton()).toHaveAttribute('aria-disabled', 'true');
    });

    test('should mark the mint button aria-disabled with a title but nothing drawn', () => {
      render(<App />);
      setTitle('My art');
      expect(mintButton()).toHaveAttribute('aria-disabled', 'true');
    });

    test('should mark the mint button aria-disabled with a drawing but no title', () => {
      const { container } = render(<App />);
      draw(container);
      expect(mintButton()).toHaveAttribute('aria-disabled', 'true');
    });

    test('should mark the mint button aria-disabled with a whitespace-only title', () => {
      const { container } = render(<App />);
      draw(container);
      setTitle('   ');
      expect(mintButton()).toHaveAttribute('aria-disabled', 'true');
    });

    test('should explain what is missing when clicking an incomplete mint button', () => {
      render(<App />);
      fireEvent.click(mintButton());
      expect(screen.getByText(/please draw something and enter a title/i)).toBeInTheDocument();
    });

    test('should only ask for a title when something is drawn', () => {
      const { container } = render(<App />);
      draw(container);
      fireEvent.click(mintButton());
      expect(screen.getByText(/please enter a title before/i)).toBeInTheDocument();
    });

    test('should enable the mint button with a drawing and a title', () => {
      const { container } = render(<App />);
      draw(container);
      setTitle('My art');
      expect(mintButton()).not.toHaveAttribute('aria-disabled');
      expect(mintButton()).toBeEnabled();
    });
  });

  describe('when Rabby is not installed', () => {
    beforeEach(() => window.history.pushState({}, '', '/?env=dev'));
    afterEach(() => window.history.pushState({}, '', '/'));

    test('should show what Rabby is, links to it and a reload hint', async () => {
      const { container } = render(<App />);
      fireEvent.click(container.getElementsByTagName('svg')[0]);
      fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'My art' } });
      fireEvent.click(screen.getByRole('button', { name: /mint the aaarto/i }));

      expect(await screen.findByText(/rabby wallet is not available/i)).toBeInTheDocument();
      expect(screen.getByText(/free browser-extension wallet/i)).toBeInTheDocument();
      expect(screen.getByText(/reload this page/i)).toBeInTheDocument();
      for (const [name, href] of [
        [/learn about rabby/i, 'https://rabby.io'],
        [/download the rabby extension/i, RABBY_DOWNLOAD_URL],
      ] as const) {
        const link = screen.getByRole('link', { name });
        expect(link).toHaveAttribute('href', href);
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      }
    });
  });

  test('should render ControlPanel component with initial props', () => {
    render(<App />);
    expect(screen.getByLabelText('Circle')).toBeChecked();
    expect(screen.getByLabelText('Size')).toHaveValue('70');
    expect(screen.getByLabelText('Color')).toHaveValue('#cccccc');
  });
});
