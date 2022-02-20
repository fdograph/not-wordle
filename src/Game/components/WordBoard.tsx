import React, { useMemo } from 'react';

import Styles from './WordBoard.module.css';
import classNames from 'classnames';

const mapPlayerGuess = (
  wordLength: number,
  selectedWord: string,
  selectedCharMap: Map<string, number>,
  playerGuess: string[]
) => {
  const found = new Map<string, number>();
  const notFound = new Map<string, number>();
  const correct = new Map<string, number>();

  playerGuess.forEach((c, idx) => {
    const foundCount = selectedCharMap.get(c) ?? 0;

    if (foundCount === 0) {
      notFound.set(c, 1);
    } else if (selectedWord[idx] === c) {
      const count = correct.get(c) ?? 0;
      correct.set(c, count + 1);
    } else {
      const count = found.get(c) ?? 0;
      found.set(c, count + 1);
    }
  });

  return { found, notFound, correct };
};

type CharStatus = 'correct' | 'found' | 'notFound' | 'neutral';
const getStatus = (
  found: Map<string, number>,
  notFound: Map<string, number>,
  correct: Map<string, number>,
  selectedWord: string,
  selectedCharMap: Map<string, number>,
  repeatedMap: Map<string, number>,
  idx: number,
  char?: string
): CharStatus => {
  if (!char || notFound.get(char) !== undefined) {
    return 'notFound';
  }
  if (selectedWord[idx] === char) {
    return 'correct';
  }

  if (found.get(char) !== undefined) {
    const correctCount = correct.get(char) ?? 0;
    const repeatedCount = repeatedMap.get(char) ?? 0;
    const selectedCount = selectedCharMap.get(char) ?? 0;
    const availCount = selectedCount - correctCount;

    if (correctCount === selectedCount) {
      return 'neutral';
    } else if (repeatedCount < availCount) {
      return 'found';
    }
  }

  return 'neutral';
};

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
  const { found, notFound, correct } = useMemo(
    () => mapPlayerGuess(wordLength, selectedWord, charMap, playerGuess),
    [charMap, playerGuess, selectedWord, wordLength]
  );
  const repeatedCount = new Map<string, number>();
  const letters = [...new Array(wordLength)].map((_, idx) => {
    const status = getStatus(
      found,
      notFound,
      correct,
      selectedWord,
      charMap,
      repeatedCount,
      idx,
      playerGuess[idx]
    );

    if (status === 'found') {
      repeatedCount.set(
        playerGuess[idx],
        (repeatedCount.get(playerGuess[idx]) ?? 0) + 1
      );
    }

    return (
      <div
        key={idx}
        className={classNames({
          [Styles.letterBox]: true,
          [Styles.withStatus]: withStatus,
          [Styles.neutral]: status === 'neutral',
          [Styles.notFound]: status === 'notFound',
          [Styles.found]: status === 'found',
          [Styles.correct]: status === 'correct',
        })}
      >
        <span>{playerGuess[idx] ? playerGuess[idx] : ''}</span>
        <span>{playerGuess[idx] ? playerGuess[idx] : ''}</span>
      </div>
    );
  });

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
