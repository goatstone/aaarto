import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../src/Header';
import '@testing-library/jest-dom';

describe('Header', () => {
  test('renders the header with the correct text', () => {
    render(<Header />);
    expect(screen.getByText(/aaarto/i)).toBeInTheDocument();
  });
});