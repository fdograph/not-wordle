import { WordBoard } from './WordBoard';
import { render, screen } from '@testing-library/react';
import { withI18n } from '../../testUtils/providers';
import Styles from './WordBoard.module.css';

describe('WordBoard', () => {
  const baseProps = {
    wordLength: 5,
    selectedWord: 'ALERT',
    charMap: new Map<string, number>(),
    playerGuess: [],
    withStatus: false,
    hasError: false,
    isWinner: false,
  };

  it('should render a default empty component', () => {
    render(withI18n(<WordBoard {...baseProps} />));
    const board = screen.getByTitle('emptyPlayerGuess');
    expect(board.classList.contains(Styles.wordBoard)).toEqual(true);
    expect(board.classList.contains(Styles.hasError)).toEqual(false);
    expect(board.classList.contains(Styles.isWinner)).toEqual(false);
  });

  it('should render the component error and winner classes', () => {
    render(withI18n(<WordBoard {...baseProps} hasError isWinner />));
    const board = screen.getByTitle('emptyPlayerGuess');
    expect(board.classList.contains(Styles.wordBoard)).toEqual(true);
    expect(board.classList.contains(Styles.hasError)).toEqual(true);
    expect(board.classList.contains(Styles.isWinner)).toEqual(true);
  });
});
