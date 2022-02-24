import React, { useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';

import Styles from './Game.module.css';
import { WordBoard } from './components/WordBoard';
import { Keyboard } from './components/Keyboard';
import { isAllowedLetter, selectWord } from './logic';
import { FinalBoard } from './components/FinalBoard';
import { useTranslation } from 'react-i18next';

const MAX_TURNS = 6;

interface GameProps {
  wordList: string[];
  wordsLength: number;
}
export const Game: React.FC<GameProps> = ({ wordList, wordsLength }) => {
  const { i18n } = useTranslation();
  const selectedWord = useMemo(
    () => selectWord(wordList, i18n.language),
    [i18n.language, wordList]
  );
  const [plays, setPlays] = useState<string[][]>([]);
  const isWinner =
    plays.length > 0 && plays[plays.length - 1].join('') === selectedWord.word;
  const isLooser = plays.length === MAX_TURNS && !isWinner;
  const [hasError, setHasError] = useState<boolean>(false);
  const [playerGuess, setPlayerGuess] = useState<string[]>([]);
  const addChar = useCallback(
    (char: string) => {
      const update = [...playerGuess];
      update.push(char.toUpperCase());
      setPlayerGuess(update);
    },
    [playerGuess]
  );
  const deleteChar = useCallback(() => {
    const update = [...playerGuess];
    update.pop();
    setHasError(false);
    setPlayerGuess(update);
  }, [playerGuess]);
  const commitPlay = useCallback(() => {
    if (wordList.indexOf(playerGuess.join('')) > -1) {
      setHasError(false);
      setPlays([...plays, playerGuess]);
      setPlayerGuess([]);
    } else {
      setHasError(true);
    }
  }, [playerGuess, plays, wordList]);

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

  console.log(selectedWord);

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
            selectedWord={selectedWord.word}
            charMap={selectedWord.chars}
            playerGuess={play}
            withStatus
            hasError={false}
            isWinner={idx === plays.length - 1 && isWinner}
          />
        ))}
        {plays.length <= MAX_TURNS - 1 && !isWinner ? (
          <WordBoard
            wordLength={wordsLength}
            selectedWord={selectedWord.word}
            charMap={selectedWord.chars}
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
            word={selectedWord.word}
            charMap={selectedWord.chars}
          />
        </div>
      ) : (
        <div className={Styles.keyboardArea}>
          <Keyboard
            onKeyPress={onInput}
            plays={plays}
            selectedWord={selectedWord.word}
          />
        </div>
      )}
    </>
  );
};
