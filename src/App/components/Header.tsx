import React from 'react';

import Styles from './Header.module.css';

export const Header: React.FC = () => {
  return (
    <header className={Styles.header}>
      <h1 className={Styles.title}>Wordle Clone</h1>
    </header>
  );
};
