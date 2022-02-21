import React from 'react';
import { useTranslation } from 'react-i18next';
import { buildTweetText, copyToClipboard } from '../logic';

import Styles from './FinalBoard.module.css';

interface FinalBoardProps {
  isWinner: boolean;
  word: string;
  charMap: Map<string, number>;
  plays: string[][];
}
export const FinalBoard: React.FC<FinalBoardProps> = ({
  isWinner,
  word,
  charMap,
  plays,
}) => {
  const { t } = useTranslation();
  const tweetText = buildTweetText(t('tweetBody'), plays, word, charMap);

  return (
    <div className={Styles.finalBoard}>
      <h2 className={Styles.title}>
        {isWinner ? t('youAreaWinner') : t('youAreaLooser')}
      </h2>
      <p className={Styles.bodyText}>{t('finalBoardBodyCopy')}</p>
      <div className={Styles.actionsWrapper}>
        <button
          className={Styles.copyButton}
          onClick={() =>
            copyToClipboard(tweetText).then(() => alert(t('copySuccessful')))
          }
        >
          {t('copyToClipboard')}
        </button>
        <a
          className={Styles.tweetButton}
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
            tweetText
          )}`}
          title={t('tweetYourScore')}
          target="_blank"
          rel="external noreferrer"
        >
          {t('tweetYourScore')}
        </a>
      </div>
    </div>
  );
};
