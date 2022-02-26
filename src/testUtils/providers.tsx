import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18nInstance from './mockI18n';
import { QueryClient, QueryClientProvider } from 'react-query';

export const withI18n = (children: React.ReactNode) => {
  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
};

const queryClient = new QueryClient();
export const withQueryClient = (children: React.ReactNode) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export const withProviders = (children: React.ReactNode) => {
  return withI18n(withQueryClient(children));
};
