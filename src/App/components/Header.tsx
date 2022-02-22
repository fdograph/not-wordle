import React, { useCallback } from 'react';

import Styles from './Header.module.css';
import { useTranslation } from 'react-i18next';
import { useQueryString } from '../../hooks/useQueryString';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const { lang } = useQueryString<{ lang: string }>(window.location.search);

  const changeLang = useCallback(() => {
    const currentUrl = window.location.search
      ? window.location.href.replace(window.location.search, '')
      : window.location.href;
    if (lang === 'es') {
      window.location.href = currentUrl;
    } else {
      window.location.href = `${currentUrl}?lang=es`;
    }
  }, [lang]);

  const targetLang = lang === 'es' ? '🇬🇧' : '🇪🇸';
  const btnText = `${t('changeLanguageToText')} ${targetLang}`;
  const btnLabel = `${t('changeLanguageToLabel')} ${targetLang}`;

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
