import React from 'react';
import { render, screen } from '@testing-library/react';
import Canvas from '@components/Canvas';
import '@testing-library/jest-dom';

describe('Canvas', () => {
  test('renders the canvas with the correct shape, size, and color', () => {
    render(<Canvas shape="circle" size={70} color="#cccccc" />);
    
    const canvasElement = screen.getByTestId('canvas');
    expect(canvasElement).toHaveAttribute('data-shape', 'circle');
    expect(canvasElement).toHaveAttribute('data-size', '70');
    expect(canvasElement).toHaveAttribute('data-color', '#cccccc');
  });

  test('applies the correct styles', () => {
    render(<Canvas shape="circle" size={70} color="#cccccc" />);
    
    const canvasElement = screen.getByTestId('canvas');

  });
});