import React, { useCallback } from 'react';

import Styles from './Header.module.css';
import { useTranslation } from 'react-i18next';

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();

  const changeLang = useCallback(() => {
    if (i18n.language === 'es') {
      i18n.changeLanguage('en');
    } else {
      i18n.changeLanguage('es');
    }
  }, [i18n]);

  const targetLangFlag = i18n.language === 'es' ? '🇬🇧' : '🇪🇸';
  const btnText = t('changeLanguageToText', { targetLangFlag });
  const btnLabel = t('changeLanguageToLabel', { targetLangFlag });

  return (
    <header className={Styles.header}>
      <div className={Styles.container}>
        <h1 className={Styles.title}>{t('appTitle')}</h1>
        <button
          className={Styles.languageButton}
          onClick={changeLang}
          title={btnLabel}
        >
          {btnText}
        </button>
      </div>
    </header>
  );
};
