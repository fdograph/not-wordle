import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18nInstance from './mockI18n';

export const withI18n = (children: React.ReactNode) => {
  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
};
