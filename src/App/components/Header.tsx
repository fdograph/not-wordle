import React from 'react';

import Styles from './Header.module.css';
import { useTranslation } from 'react-i18next';

export const Header: React.FC = () => {
  const { t } = useTranslation();

  return (
    <header className={Styles.header}>
      <h1 className={Styles.title}>{t('appTitle')}</h1>
    </header>
  );
};
