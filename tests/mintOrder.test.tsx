import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '@components/App';
import uploadData from '../src/uploadData';
import { mintNFT } from '../src/mintNFT';
import { connectRabbyWallet } from '../src/rabbyHelpers';

jest.mock('../src/uploadData', () => ({
  ...jest.requireActual('../src/uploadData'),
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('../src/mintNFT', () => ({ mintNFT: jest.fn() }));
jest.mock('../src/rabbyHelpers', () => ({
  ...jest.requireActual('../src/rabbyHelpers'),
  connectRabbyWallet: jest.fn(),
}));

const mocked = (fn: unknown) => fn as jest.Mock;

describe('mint order', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.history.pushState({}, '', '/?env=full');
    jest.spyOn(console, 'log').mockImplementation(() => {});
    mocked(connectRabbyWallet).mockResolvedValue({ account: '0xabc', ethereum: {} });
    mocked(uploadData).mockResolvedValue({ ipfsHash: 'img', ipfsHashMD: 'md' });
    mocked(mintNFT).mockResolvedValue({ tokenId: '1', hash: '0xhash' });
  });
  afterEach(() => {
    window.history.pushState({}, '', '/');
    mocked(console.log).mockRestore();
  });

  const ready = () => {
    const { container } = render(<App />);
    fireEvent.click(container.getElementsByTagName('svg')[0]);
    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'My art' } });
  };
  // hidden: the open modal marks the rest of the page aria-hidden
  const mintButton = () =>
    screen.getByRole('button', { name: /mint the aaarto|minting, please wait/i, hidden: true });

  test('connects the wallet before uploading (#79)', async () => {
    const calls: string[] = [];
    mocked(connectRabbyWallet).mockImplementation(async () => {
      calls.push('connect');
      return { account: '0xabc', ethereum: {} };
    });
    mocked(uploadData).mockImplementation(async () => {
      calls.push('upload');
      return { ipfsHash: 'img', ipfsHashMD: 'md' };
    });
    ready();
    fireEvent.click(mintButton());
    await waitFor(() => expect(mintNFT).toHaveBeenCalled());
    expect(calls).toEqual(['connect', 'upload']);
  });

  test('pins nothing when the wallet connection is cancelled (#79)', async () => {
    mocked(connectRabbyWallet).mockRejectedValue(new Error('User rejected the request'));
    ready();
    fireEvent.click(mintButton());
    await waitFor(() => expect(connectRabbyWallet).toHaveBeenCalled());
    await waitFor(() => expect(mintButton()).not.toBeDisabled());
    expect(uploadData).not.toHaveBeenCalled();
    expect(mintNFT).not.toHaveBeenCalled();
  });

  test('keeps the mint button disabled when the modal is closed mid-transaction (#78)', async () => {
    let finish: (v: { tokenId: string; hash: string }) => void = () => {};
    mocked(mintNFT).mockReturnValue(new Promise((resolve) => { finish = resolve; }));
    ready();
    fireEvent.click(mintButton());
    await waitFor(() => expect(mintNFT).toHaveBeenCalled());

    fireEvent.click(screen.getByRole('button', { name: 'X', hidden: true }));
    expect(mintButton()).toBeDisabled();
    fireEvent.click(mintButton());
    expect(connectRabbyWallet).toHaveBeenCalledTimes(1);

    finish({ tokenId: '1', hash: '0xhash' });
    await waitFor(() => expect(mintButton()).not.toBeDisabled());
  });

  test('shows the success result again when the modal was closed mid-transaction', async () => {
    let finish: (v: { tokenId: string; hash: string }) => void = () => {};
    mocked(mintNFT).mockReturnValue(new Promise((resolve) => { finish = resolve; }));
    ready();
    fireEvent.click(mintButton());
    await waitFor(() => expect(mintNFT).toHaveBeenCalled());
    fireEvent.click(screen.getByRole('button', { name: 'X', hidden: true }));
    // Fluent's Modal unmounts after its close animation
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: 'X', hidden: true })).not.toBeInTheDocument(),
    );

    finish({ tokenId: '1', hash: '0xhash' });
    expect(await screen.findByText(/mint success/i)).toBeInTheDocument();
  });

  test('shows the failure again when the modal was closed mid-transaction', async () => {
    let fail: (e: Error) => void = () => {};
    mocked(mintNFT).mockReturnValue(new Promise((_resolve, reject) => { fail = reject; }));
    ready();
    fireEvent.click(mintButton());
    await waitFor(() => expect(mintNFT).toHaveBeenCalled());
    fireEvent.click(screen.getByRole('button', { name: 'X', hidden: true }));
    // Fluent's Modal unmounts after its close animation
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: 'X', hidden: true })).not.toBeInTheDocument(),
    );

    fail(new Error('boom'));
    expect(await screen.findByRole('button', { name: 'X', hidden: true })).toBeInTheDocument();
  });

  test('re-enables the mint button after a failed mint (#78)', async () => {
    mocked(mintNFT).mockRejectedValue(new Error('boom'));
    ready();
    fireEvent.click(mintButton());
    await waitFor(() => expect(mintNFT).toHaveBeenCalled());
    await waitFor(() => expect(mintButton()).not.toBeDisabled());
  });
});
