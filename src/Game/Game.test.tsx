import { fireEvent, render, screen } from '@testing-library/react';
import { withI18n } from '../testUtils/providers';
import { Game } from './Game';

import Styles from './Game.module.css';
import { processWord } from './logic';

describe('Game Component', () => {
  const selectedWord = 'ALERT';
  const validWords = ['QUERY', 'HEART', 'BLISS', 'COOLS'];
  const selection = processWord([selectedWord, ...validWords], selectedWord);

  const baseProps = {
    word: selection.word,
    wordsSet: selection.wordSet,
    wordCharMap: selection.chars,
    wordsLength: 5,
    maxTurns: 3,
  };

  it('Should render a default game board', () => {
    render(withI18n(<Game {...baseProps} />));

    const playerGuess = screen.getByTitle('emptyPlayerGuess');
    expect(playerGuess).toBeTruthy();
  });

  it('Should render show an error when a word is not valid', () => {
    render(withI18n(<Game {...baseProps} />));

    fireEvent.click(screen.getByText('p'));
    fireEvent.click(screen.getByText('o'));
    fireEvent.click(screen.getByText('i'));
    fireEvent.click(screen.getByText('n'));
    fireEvent.click(screen.getByText('t'));
    fireEvent.click(screen.getByTitle('ENTER'));

    const playerGuess = screen.getByTitle('playerGuess');
    expect(playerGuess).toBeTruthy();
    expect(playerGuess.classList.contains(Styles.hasError)).toEqual(true);
  });

  it('Should show a new board after a play', () => {
    render(withI18n(<Game {...baseProps} />));

    // type the letters of a valid but incorrect word
    validWords[0]
      .toLowerCase()
      .split('')
      .forEach((c) => {
        fireEvent.click(screen.getByText(c));
      });

    fireEvent.click(screen.getByTitle('ENTER'));

    expect(screen.getAllByTitle('playerGuess')).toHaveLength(1);
    expect(screen.getAllByTitle('emptyPlayerGuess')).toHaveLength(1);
  });

  it('Should show as much plays as committed with ENTER', () => {
    render(withI18n(<Game {...baseProps} />));

    // type the letters of a valid but incorrect word
    [validWords[0], validWords[1]].forEach((word) => {
      word
        .toLowerCase()
        .split('')
        .forEach((c) => {
          fireEvent.click(screen.getByText(c));
        });

      fireEvent.click(screen.getByTitle('ENTER'));
    });

    expect(screen.getAllByTitle('playerGuess')).toHaveLength(2);
    expect(screen.getAllByTitle('emptyPlayerGuess')).toHaveLength(1);
  });

  it('Should allow to commit plays up to maxTurns and then loose', () => {
    render(withI18n(<Game {...baseProps} />));

    // type the letters of a valid but incorrect word
    [validWords[0], validWords[1], validWords[2]].forEach((word) => {
      word.split('').forEach((c) => {
        fireEvent.click(screen.getByTitle(c));
      });

      fireEvent.click(screen.getByTitle('ENTER'));
    });

    expect(screen.getAllByTitle('playerGuess')).toHaveLength(
      baseProps.maxTurns
    );
    expect(screen.queryAllByTitle('emptyPlayerGuess')).toHaveLength(0);
  });

  it('Should allow to delete characters using BACKSPACE', () => {
    render(withI18n(<Game {...baseProps} />));

    fireEvent.click(screen.getByText('p'));
    fireEvent.click(screen.getByText('o'));
    fireEvent.click(screen.getByText('i'));
    fireEvent.click(screen.getByTitle('BACKSPACE'));
    fireEvent.click(screen.getByTitle('BACKSPACE'));
    fireEvent.click(screen.getByTitle('BACKSPACE'));

    // type the letters of a valid but incorrect word
    [validWords[0], validWords[1]].forEach((word) => {
      word.split('').forEach((c) => {
        fireEvent.click(screen.getByTitle(c));
      });

      fireEvent.click(screen.getByTitle('ENTER'));
    });

    expect(screen.getAllByTitle('playerGuess')).toHaveLength(2);
    expect(screen.queryAllByTitle('emptyPlayerGuess')).toHaveLength(1);
  });

  it('Should win the game and show winning text', () => {
    render(withI18n(<Game {...baseProps} />));

    fireEvent.click(screen.getByText('a'));
    fireEvent.click(screen.getByText('l'));
    fireEvent.click(screen.getByText('e'));
    fireEvent.click(screen.getByText('r'));
    fireEvent.click(screen.getByText('t'));
    fireEvent.click(screen.getByTitle('ENTER'));

    expect(screen.getAllByTitle('playerGuess')).toHaveLength(1);
    expect(screen.queryAllByText('emptyPlayerGuess')).toHaveLength(0);
    expect(screen.queryAllByText('youAreaWinner')).toHaveLength(1);
  });
});
