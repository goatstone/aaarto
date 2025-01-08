import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ControlPanel from '@components/ControlPanel';
import '@testing-library/jest-dom';

// Mock props
const mockSetShape = jest.fn();
const mockSetSize = jest.fn();
const mockSetColor = jest.fn();
const mockConnectWallet = jest.fn();
const mockOpenMetaMask = jest.fn();

const defaultProps = {
    shape: 'circle',
    setShape: mockSetShape,
    size: 70,
    setSize: mockSetSize,
    color: '#cccccc',
    setColor: mockSetColor,
    account: '',
    connectWallet: mockConnectWallet,
    openMetaMask: mockOpenMetaMask,
};

describe('ControlPanel', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders the ControlPanel component', () => {
        render(<ControlPanel {...defaultProps} />);

        // Check if the labels are rendered
        expect(screen.getByLabelText('Circle')).toBeInTheDocument();
        expect(screen.getByLabelText('Square')).toBeInTheDocument();
        expect(screen.getByLabelText('Erase')).toBeInTheDocument();
        expect(screen.getByLabelText('Size')).toBeInTheDocument();
        expect(screen.getByLabelText('Color')).toBeInTheDocument();
    });

    test('calls setShape when shape radio buttons are clicked', () => {
        render(<ControlPanel {...defaultProps} />);

        const squareRadio = screen.getByLabelText('Square');
        fireEvent.click(squareRadio);
        expect(mockSetShape).toHaveBeenCalledWith('square');

        const eraseRadio = screen.getByLabelText('Erase');
        fireEvent.click(eraseRadio);
        expect(mockSetShape).toHaveBeenCalledWith('erase');
    });

    test('calls setSize when size slider is changed', () => {
        render(<ControlPanel {...defaultProps} />);

        const sizeSlider = screen.getByLabelText('Size');
        fireEvent.change(sizeSlider, { target: { value: '100' } });
        expect(mockSetSize).toHaveBeenCalledWith(100);
    });

    test('calls setColor when color input is changed', () => {
        render(<ControlPanel {...defaultProps} />);

        const colorInput = screen.getByLabelText('Color');
        fireEvent.change(colorInput, { target: { value: '#ff0000' } });
        expect(mockSetColor).toHaveBeenCalledWith('#ff0000');
    });

    test('renders Open MetaMask Create buttons', () => {
        render(<ControlPanel {...defaultProps} />);

        expect(screen.getByText('Open MetaMask')).toBeInTheDocument();
        expect(screen.getByText('Create')).toBeDisabled();
    });
});