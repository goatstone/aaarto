import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MintControl from '../src/components/MintControl';

const button = () => screen.getByRole('button');

describe('MintControl tooltip (#150)', () => {
  test('names the drawing when only the drawing is missing', () => {
    render(<MintControl handleMint={() => {}} isMinting={false} canMint={false} missingText="draw something" />);
    expect(button()).toHaveAttribute('title', 'Please draw something\nbefore you mint your Aaarto.');
  });

  test('names the title when only the title is missing', () => {
    render(<MintControl handleMint={() => {}} isMinting={false} canMint={false} missingText="enter a title" />);
    expect(button()).toHaveAttribute('title', 'Please enter a title\nbefore you mint your Aaarto.');
  });

  test('names both when neither is there', () => {
    render(
      <MintControl handleMint={() => {}} isMinting={false} canMint={false} missingText="draw something and enter a title" />,
    );
    expect(button()).toHaveAttribute(
      'title',
      'Please draw something and enter a title\nbefore you mint your Aaarto.',
    );
  });

  test('gives screen readers the same reason', () => {
    render(<MintControl handleMint={() => {}} isMinting={false} canMint={false} missingText="enter a title" />);
    expect(button()).toHaveAccessibleDescription('Please enter a title before you mint your Aaarto.');
  });

  test('has no tooltip once the art and the title are there', () => {
    render(<MintControl handleMint={() => {}} isMinting={false} canMint missingText="" />);
    expect(button()).not.toHaveAttribute('title');
    expect(button()).not.toHaveAttribute('aria-describedby');
  });

  test('has no tooltip while a mint is under way', () => {
    render(<MintControl handleMint={() => {}} isMinting canMint={false} missingText="enter a title" />);
    expect(button()).not.toHaveAttribute('title');
  });

  test('is enabled by default and reads "Mint The Aaarto"', () => {
    render(<MintControl handleMint={() => {}} isMinting={false} />);
    expect(button()).toBeEnabled();
    expect(button()).toHaveTextContent('Mint The Aaarto');
  });
});
