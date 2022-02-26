import { FinalBoard } from './FinalBoard';
import { fireEvent, render, screen } from '@testing-library/react';
import { withI18n } from '../../testUtils/providers';
import { delay } from '../../testUtils/common';

const originalClipboard = { ...global.navigator.clipboard };

describe('FinalBoard', () => {
  const baseProps = {
    isWinner: true,
    word: 'ALERT',
    charMap: new Map(),
    plays: [],
  };

  beforeEach(() => {
    // @ts-ignore
    global.navigator.clipboard = {
      writeText: jest.fn((data) => Promise.resolve()),
    };
    window.alert = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
    // @ts-ignore
    global.navigator.clipboard = originalClipboard;
  });

  it('Should show the winner copy when the prop isWinner is true', () => {
    render(withI18n(<FinalBoard {...baseProps} />));
    const heading = screen.getByText('youAreaWinner');
    expect(heading).toBeTruthy();
  });

  it('Should show the looser copy when the prop isWinner is false', () => {
    render(withI18n(<FinalBoard {...baseProps} isWinner={false} />));
    const heading = screen.getByText('youAreaLooser');
    expect(heading).toBeTruthy();
  });

  it('Should copy some test to the clipboard', async () => {
    render(withI18n(<FinalBoard {...baseProps} />));
    const btn = screen.getByText('copyToClipboard');

    fireEvent.click(btn);
    await delay();

    expect(global.navigator.clipboard.writeText).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalled();
  });
});
