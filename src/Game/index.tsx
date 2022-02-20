import React, { useCallback, useEffect, useMemo, useState } from 'react';

import Styles from './Game.module.css';
import { WordBoard } from './components/WordBoard';
import { Keyboard } from './components/Keyboard';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

// only single letters allowed (a-z|A-Z)
const isAllowedLetter = (s: string) => s.length === 1 && /[a-zñ]/gi.test(s);

const selectWord = (list: string[]) => {
  const word = list[~~(list.length * Math.random())];
  const chars = word.split('').reduce((map, char) => {
    const count = map.get(char) ?? 0;

    map.set(char, count + 1);
    return map;
  }, new Map<string, number>());

  return {
    word,
    chars,
  };
};

interface GameProps {
  wordList: string[];
  wordsLength: number;
}
export const Game: React.FC<GameProps> = ({ wordList, wordsLength }) => {
  const { t } = useTranslation();
  const selectedWord = useMemo(() => selectWord(wordList), [wordList]);
  const [plays, setPlays] = useState<string[][]>([]);
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
    const isWinner = playerGuess.join('') === selectedWord.word;
    setIsWinner(isWinner);
    if (isWinner) {
      alert(t('winnerText'));
    }
  }, [playerGuess, selectedWord.word, t]);

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

    return () => {
      window.removeEventListener('keyup', onKeyUp);
    };
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
        {plays.length <= 5 && !isWinner ? (
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
      <div className={Styles.keyboardArea}>
        <Keyboard
          onKeyPress={onInput}
          plays={plays}
          selectedWord={selectedWord.word}
        />
      </div>
    </>
  );
};
