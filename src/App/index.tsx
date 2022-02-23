import React from 'react';

import { Header } from './components/Header';
import { Game } from '../Game';
import { useQuery } from 'react-query';

import Styles from './App.module.css';
import { Footer } from './components/Footer';
import { useTranslation } from 'react-i18next';

const WORDS_LENGTH = 5;

const fetchWordsList = async (lang: string): Promise<string[]> => {
  const wordsJson = lang === 'es' ? '/data/es.json' : '/data/en.json';
  return fetch(`${window.location.origin}${wordsJson}`)
    .then((r) => r.json())
    .then((list) => list.words.map((w: string) => w.toUpperCase()));
};

const App: React.FC = () => {
  const { i18n } = useTranslation();
  const query = useQuery<string[]>(
    ['wordsList', i18n.language],
    () => fetchWordsList(i18n.language),
    {
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  return query.isLoading ? (
    <div className={Styles.loadingWrapper}>
      <div className={Styles.spinner} />
    </div>
  ) : (
    <>
      <Header />
      <Game wordsLength={WORDS_LENGTH} wordList={query.data!} />
      <Footer />
    </>
  );
};

export default App;
