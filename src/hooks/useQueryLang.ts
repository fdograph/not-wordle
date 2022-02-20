import { useTranslation } from 'react-i18next';
import { useQueryString } from './useQueryString';
import { useEffect } from 'react';

export const useQueryLang = (search: string) => {
  const params = useQueryString<{ lang: string }>(search);
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(params.lang);
  }, [i18n, params.lang]);

  return { lang: params.lang };
};
