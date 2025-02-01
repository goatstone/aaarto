import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '@components/App';

describe('App', () => {

  test('should render expected text', () => {
    render(<App />);
    expect(screen.queryAllByText(/aaarto/i).length).toBe(2);
  });

  test('should render an SVG tag', () => {
    const { container } = render(<App />);
    const a = container.getElementsByTagName('svg')[0];
    expect(a).toBeInTheDocument()
  });

  test('should render ControlPanel component with initial props', () => {
    render(<App />);
    expect(screen.getByLabelText('Circle')).toBeChecked();
    expect(screen.getByLabelText('Size')).toHaveValue('70');
    expect(screen.getByLabelText('Color')).toHaveValue('#cccccc');
  });
});
