import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import Styles from './Game.module.css';
import { WordBoard } from './components/WordBoard';
import { Keyboard } from './components/Keyboard';
import { buildTweetText, isAllowedLetter, selectWord } from './logic';
import { FinalBoard } from './components/FinalBoard';

const MAX_TURNS = 6;

interface GameProps {
  wordList: string[];
  wordsLength: number;
}
export const Game: React.FC<GameProps> = ({ wordList, wordsLength }) => {
  const { t } = useTranslation();
  const selectedWord = useMemo(() => selectWord(wordList), [wordList]);
  const [plays, setPlays] = useState<string[][]>([]);
  const [isLooser, setIsLooser] = useState<boolean>(false);
  const [isWinner, setIsWinner] = useState<boolean>(false);
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

  const checkWin = useCallback(() => {
    if (playerGuess.join('') === selectedWord.word) {
      setIsWinner(true);
      setIsLooser(false);
    } else if (plays.length + 1 >= MAX_TURNS) {
      setIsWinner(false);
      setIsLooser(true);
    }
  }, [playerGuess, plays, selectedWord.word]);

  const onInput = useCallback(
    (keyInput: string) => {
      if (isAllowedLetter(keyInput) && playerGuess.length < wordsLength) {
        addChar(keyInput);
      } else if (
        (keyInput === 'Backspace' || keyInput === 'Borrar') &&
        playerGuess.length >= 1
      ) {
        deleteChar();
      } else if (keyInput === 'Enter' && playerGuess.length === wordsLength) {
        commitPlay();
        checkWin();
      }
    },
    [addChar, checkWin, commitPlay, deleteChar, playerGuess.length, wordsLength]
  );
  const onKeyUp = useCallback(
    (ev: KeyboardEvent) => {
      onInput(ev.key);
    },
    [onInput]
  );

  useEffect(() => {
    window.addEventListener('keyup', onKeyUp);
    return () => window.removeEventListener('keyup', onKeyUp);
  }, [onKeyUp]);

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
