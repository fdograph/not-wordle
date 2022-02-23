import React, { useMemo } from 'react';

import Styled from './Keyboard.module.css';
import classNames from 'classnames';
import { useQueryString } from '../../hooks/useQueryString';
import { langKeyboard, mapCorrect } from '../logic';

interface KeyProps {
  value: string;
  label: string;
  isFound?: boolean;
  isNotFound?: boolean;
  isCorrect?: boolean;
  onClick: (value: string) => void;
}
const Key: React.FC<KeyProps> = ({
  value,
  label,
  isFound,
  isNotFound,
  isCorrect,
  onClick,
}) => {
  return (
    <button
      className={classNames({
        [Styled.key]: true,
        [Styled.correct]: isCorrect,
        [Styled.found]: isFound,
        [Styled.notFound]: isNotFound,
      })}
      onClick={() => onClick(value)}
      aria-label={`${value} key`}
    >
      {label}
    </button>
  );
};

interface KeyboardProps {
  onKeyPress: (value: string) => void;
  plays: string[][];
  selectedWord: string;
}
export const Keyboard: React.FC<KeyboardProps> = ({
  onKeyPress,
  plays,
  selectedWord,
}) => {
  const { lang } = useQueryString(window.location.search);
  const status = useMemo(() => {
    const statusMap = new Map<
      string,
      { isFound: boolean; isNotFound: boolean; isCorrect: boolean }
    >();

    const corrects = new Map<string, number>(
      plays
        .map((chars) => [...mapCorrect(selectedWord, chars).entries()])
        .flat(1)
    );

    plays.forEach((chars) => {
      return chars.forEach((c, idx) => {
        statusMap.set(c, {
          isFound: selectedWord.indexOf(c.toUpperCase()) !== -1,
          isNotFound: selectedWord.indexOf(c.toUpperCase()) === -1,
          isCorrect: corrects.get(c) !== undefined,
        });
      });
    });

    return statusMap;
  }, [plays, selectedWord]);

  const keyRows = useMemo(() => {
    const keyMatrix = lang === 'es' ? langKeyboard.es : langKeyboard.en;

    return keyMatrix.map((row) => (
      <div key={row.join('')}>
        {row.map((keyVal) => (
          <Key
            key={keyVal.val}
            value={keyVal.val}
            label={keyVal.label}
            isCorrect={status.get(keyVal.val.toUpperCase())?.isCorrect}
            isFound={status.get(keyVal.val.toUpperCase())?.isFound}
            isNotFound={status.get(keyVal.val.toUpperCase())?.isNotFound}
            onClick={onKeyPress}
          />
        ))}
      </div>
    ));
  }, [lang, onKeyPress, status]);

  return <div className={Styled.keyboard}>{keyRows}</div>;
};
