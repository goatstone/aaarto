import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
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

describe('follows the wallet account (#145)', () => {
  let handlers: Record<string, (...args: any[]) => void>;
  let removeListener: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    handlers = {};
    removeListener = jest.fn();
    window.history.pushState({}, '', '/?env=full');
    jest.spyOn(console, 'log').mockImplementation(() => {});
    const ethereum = {
      on: (event: string, handler: (...args: any[]) => void) => { handlers[event] = handler; },
      removeListener,
    };
    mocked(connectRabbyWallet).mockResolvedValue({ account: '0xaaa', ethereum });
    mocked(uploadData).mockResolvedValue({ ipfsHash: 'img', ipfsHashMD: 'md' });
    mocked(mintNFT).mockResolvedValue({ tokenId: '1', hash: '0xhash' });
  });
  afterEach(() => {
    window.history.pushState({}, '', '/');
    mocked(console.log).mockRestore();
  });

  const mint = async () => {
    const view = render(<App />);
    fireEvent.click(view.container.getElementsByTagName('svg')[0]);
    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'My art' } });
    fireEvent.click(
      screen.getByRole('button', { name: /mint the aaarto/i, hidden: true }),
    );
    await waitFor(() => expect(mintNFT).toHaveBeenCalled());
    await screen.findByText(/mint success/i);
    return view;
  };

  test('shows the new account when the wallet switches', async () => {
    await mint();
    expect(screen.getAllByText(/0xaaa/).length).toBeGreaterThan(0);
    act(() => handlers.accountsChanged(['0xbbb']));
    expect(screen.getByText('Connected Account: 0xbbb')).toBeInTheDocument();
  });

  test('shows "No account connected" when the wallet is locked or disconnected', async () => {
    await mint();
    act(() => handlers.accountsChanged([]));
    expect(screen.getByText('No account connected')).toBeInTheDocument();
  });

  test('the mint result keeps naming the account that sent it', async () => {
    await mint();
    act(() => handlers.accountsChanged(['0xbbb']));
    expect(screen.getByText(/Connected Account: 0xaaa/)).toBeInTheDocument();
  });

  test('removes the listener on unmount', async () => {
    const { unmount } = await mint();
    unmount();
    expect(removeListener).toHaveBeenCalledWith('accountsChanged', handlers.accountsChanged);
  });
});
