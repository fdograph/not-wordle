import React from 'react';

import Styles from './Footer.module.css';
import { useTranslation } from 'react-i18next';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className={Styles.footer}>
      <a
        className={Styles.footerLink}
        target="_blank"
        rel="external nofollow noreferrer"
        href="https://github.com/fdograph/not-wordle"
      >
        {t('viewOnGithub')}
      </a>
    </footer>
  );
};
