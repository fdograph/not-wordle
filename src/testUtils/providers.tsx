import React from 'react';
import { I18nextProvider, I18nextProviderProps } from 'react-i18next';
import i18nInstance from './mockI18n';
import { QueryClient, QueryClientProvider } from 'react-query';

const mockI18nInstance = (mock: Partial<I18nextProviderProps['i18n']>) => ({
  ...i18nInstance,
  on: jest.fn(),
  off: jest.fn(),
  ...mock,
});

export const withI18n = (
  children: React.ReactNode,
  mock?: Partial<I18nextProviderProps['i18n']>
) => {
  let mockI18n = i18nInstance;

  if (mock !== undefined) {
    mockI18n = mockI18nInstance(mock);
  }

  return <I18nextProvider i18n={mockI18n}>{children}</I18nextProvider>;
};

const queryClient = new QueryClient();
export const withQueryClient = (children: React.ReactNode) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export const withProviders = (
  children: React.ReactNode,
  mockI18n?: Partial<I18nextProviderProps['i18n']>
) => {
  return withI18n(withQueryClient(children), mockI18n);
};
