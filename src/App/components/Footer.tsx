import React from 'react';

import Styles from './Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={Styles.footer}>
      <a
        className={Styles.footerLink}
        target="_blank"
        rel="external nofollow noreferrer"
        href="https://github.com/fdograph/not-wordle"
      >
        View source code on Github
      </a>
    </footer>
  );
};
