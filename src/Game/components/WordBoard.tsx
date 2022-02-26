import React from 'react';

import Styles from './WordBoard.module.css';
import classNames from 'classnames';
import { mapGuess } from '../logic';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const statusMap = mapGuess(playerGuess, selectedWord, charMap);
  const letters = [...new Array(wordLength)].map((_, idx) => (
    <div
      key={idx}
      className={classNames({
        [Styles.letterBox]: true,
        [Styles.withStatus]: withStatus,
        [Styles.neutral]:
          !statusMap[idx] || statusMap[idx]?.status === 'neutral',
        [Styles.notFound]: statusMap[idx]?.status === 'notFound',
        [Styles.found]: statusMap[idx]?.status === 'found',
        [Styles.correct]: statusMap[idx]?.status === 'correct',
      })}
      aria-label={playerGuess[idx] ? playerGuess[idx] : ''}
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
      aria-label={playerGuess.join('-')}
      title={
        playerGuess.length
          ? t('playerGuess', { guess: playerGuess.join('-') })
          : t('emptyPlayerGuess')
      }
    >
      {letters}
    </div>
  );
};
