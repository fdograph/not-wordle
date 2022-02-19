import React from 'react';

import Styles from './WordBoard.module.css';
import classNames from 'classnames';

const isNotFound = (
  playerGuess: string[],
  selectedCharsMap: Map<string, number>,
  idx: number
): boolean => {
  const count = selectedCharsMap.get(playerGuess[idx]) ?? 0;
  return playerGuess[idx] !== undefined && count === 0;
};

const isFound = (
  playerGuess: string[],
  selectedCharsMap: Map<string, number>,
  idx: number
): boolean => {
  const guessMaps = playerGuess.reduce((map, c) => {
    const count = map.get(c) ?? 0;

    map.set(c, count + 1);
    return map;
  }, new Map<string, number>());
  const char = playerGuess[idx];
  const guessCount = guessMaps.get(char) ?? 0;
  const selectedCount = selectedCharsMap.get(char) ?? 0;

  if (selectedCount <= 0) {
    return false;
  } else if (selectedCount === 1) {
    return true;
  }

  return guessCount <= selectedCount;
};

const isCorrect = (
  playerGuess: string[],
  selectedWord: string,
  selectedCharsMap: Map<string, number>,
  idx: number
): boolean =>
  !isNotFound(playerGuess, selectedCharsMap, idx) &&
  playerGuess[idx] === selectedWord[idx];

interface WordBoardProps {
  className?: string;
  wordLength: number;
  selectedWord: string;
  charMap: Map<string, number>;
  playerGuess: string[];
  withStatus: boolean;
  hasError: boolean;
  isWinner: boolean;
}
export const WordBoard: React.FC<WordBoardProps> = ({
  className,
  wordLength,
  selectedWord,
  charMap,
  playerGuess,
  withStatus,
  hasError,
  isWinner,
}) => {
  const letters = [...new Array(wordLength)].map((_, idx) => (
    <div
      key={idx}
      className={classNames({
        [Styles.letterBox]: true,
        [Styles.withStatus]: withStatus,
        [Styles.notFound]: isNotFound(playerGuess, charMap, idx),
        [Styles.found]: isFound(playerGuess, charMap, idx),
        [Styles.correct]: isCorrect(playerGuess, selectedWord, charMap, idx),
      })}
    >
      <span>{playerGuess[idx] ? playerGuess[idx] : ''}</span>
      <span>{playerGuess[idx] ? playerGuess[idx] : ''}</span>
    </div>
  ));

  return (
    <div
      className={classNames(className, {
        [Styles.wordBoard]: true,
        [Styles.hasError]: hasError,
        [Styles.isWinner]: isWinner,
      })}
    >
      {letters}
    </div>
  );
};
