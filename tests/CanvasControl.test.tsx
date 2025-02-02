import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CanvasControl from '@components/CanvasControl';
import '@testing-library/jest-dom';

const mockSetShape = jest.fn();
const mockSetSize = jest.fn();
const mockSetColor = jest.fn();

const defaultProps = {
  shape: 'circle',
  setShape: mockSetShape,
  size: 70,
  setSize: mockSetSize,
  color: '#cccccc',
  setColor: mockSetColor,
};

describe('CanvasControl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should have expected labels', () => {
    render(<CanvasControl {...defaultProps} />);

    expect(screen.getByLabelText('Circle')).toBeInTheDocument();
    expect(screen.getByLabelText('Square')).toBeInTheDocument();
    expect(screen.getByLabelText('Erase')).toBeInTheDocument();
    expect(screen.getByLabelText('Size')).toBeInTheDocument();
    expect(screen.getByLabelText('Color')).toBeInTheDocument();
  });

  test('should call setShape when shape radio buttons are clicked', () => {
    render(<CanvasControl {...defaultProps} />);

    const squareRadio = screen.getByLabelText('Square');
    fireEvent.click(squareRadio);
    expect(mockSetShape).toHaveBeenCalledWith('square');

    const eraseRadio = screen.getByLabelText('Erase');
    fireEvent.click(eraseRadio);
    expect(mockSetShape).toHaveBeenCalledWith('erase');
  });

  test('should call setSize when size slider is changed', () => {
    render(<CanvasControl {...defaultProps} />);

    const sizeSlider = screen.getByLabelText('Size');
    fireEvent.change(sizeSlider, { target: { value: '100' } });
    expect(mockSetSize).toHaveBeenCalledWith(100);
  });

  test('should call setColor when color input is changed', () => {
    render(<CanvasControl {...defaultProps} />);

    const colorInput = screen.getByLabelText('Color');
    fireEvent.change(colorInput, { target: { value: '#ff0000' } });
    expect(mockSetColor).toHaveBeenCalledWith('#ff0000');
  });

});
