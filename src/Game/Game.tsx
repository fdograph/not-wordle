import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';

import Styles from './Game.module.css';
import { WordBoard } from './components/WordBoard';
import { Keyboard } from './components/Keyboard';
import { isAllowedLetter } from './logic';
import { FinalBoard } from './components/FinalBoard';
import { useTranslation } from 'react-i18next';

interface GameProps {
  word: string;
  wordsSet: Set<string>;
  wordCharMap: Map<string, number>;
  wordsLength: number;
  maxTurns: number;
}
export const Game: React.FC<GameProps> = ({
  word,
  wordsSet,
  wordCharMap,
  wordsLength,
  maxTurns,
}) => {
  const { i18n } = useTranslation();
  const [hasError, setHasError] = useState<boolean>(false);
  const [plays, setPlays] = useState<string[][]>([]);
  const [playerGuess, setPlayerGuess] = useState<string[]>([]);
  const isWinner =
    plays.length > 0 && plays[plays.length - 1].join('') === word;
  const isLooser = plays.length === maxTurns && !isWinner;
  const addChar = useCallback(
    (char: string) => {
      setPlayerGuess([...playerGuess, char.toUpperCase()]);
    },
    [playerGuess]
  );
  const deleteChar = useCallback(() => {
    setHasError(false);
    setPlayerGuess(playerGuess.slice(0, playerGuess.length - 1));
  }, [playerGuess]);
  const commitPlay = useCallback(() => {
    if (wordsSet.has(playerGuess.join(''))) {
      setHasError(false);
      setPlays([...plays, playerGuess]);
      setPlayerGuess([]);
    } else {
      setHasError(true);
    }
  }, [playerGuess, plays, wordsSet]);
  const reset = useCallback(() => {
    setPlays([]);
    setHasError(false);
    setPlayerGuess([]);
  }, []);
  const onInput = useCallback(
    (keyInput: string) => {
      if (isAllowedLetter(keyInput) && playerGuess.length < wordsLength) {
        addChar(keyInput);
      } else if (keyInput === 'BACKSPACE' && playerGuess.length >= 1) {
        deleteChar();
      } else if (keyInput === 'ENTER' && playerGuess.length === wordsLength) {
        commitPlay();
      }
    },
    [addChar, commitPlay, deleteChar, playerGuess.length, wordsLength]
  );
  const onKeyUp = useCallback(
    (ev: KeyboardEvent) => {
      onInput(ev.key.toUpperCase());
    },
    [onInput]
  );

  useEffect(() => {
    i18n.on('languageChanged', reset);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keyup', onKeyUp);
      i18n.off('languageChanged', reset);
    };
  }, [i18n, onKeyUp, reset]);

  return (
    <>
      <div
        className={classNames({
          [Styles.gameBoard]: true,
          [Styles.hasWinner]: isWinner,
        })}
      >
        {plays.map((play, idx) => (
          <WordBoard
            key={idx}
            className={classNames({
              [Styles.play]: true,
              [Styles.winnerPlay]: idx === plays.length - 1 && isWinner,
            })}
            wordLength={wordsLength}
            selectedWord={word}
            charMap={wordCharMap}
            playerGuess={play}
            withStatus
            hasError={false}
            isWinner={idx === plays.length - 1 && isWinner}
          />
        ))}
        {plays.length <= maxTurns - 1 && !isWinner ? (
          <WordBoard
            wordLength={wordsLength}
            selectedWord={word}
            charMap={wordCharMap}
            playerGuess={playerGuess}
            withStatus={false}
            hasError={hasError}
            isWinner={false}
          />
        ) : null}
      </div>
      {isWinner || isLooser ? (
        <div className={Styles.finalBoardArea}>
          <FinalBoard
            isWinner={isWinner}
            plays={plays}
            word={word}
            charMap={wordCharMap}
          />
        </div>
      ) : (
        <div className={Styles.keyboardArea}>
          <Keyboard onKeyPress={onInput} plays={plays} selectedWord={word} />
        </div>
      )}
    </>
  );
};
