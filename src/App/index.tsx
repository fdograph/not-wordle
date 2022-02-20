import React from 'react';

import { Header } from './components/Header';
import { Game } from '../Game';
import { useQuery } from 'react-query';

import Styles from './App.module.css';
import { useQueryLang } from '../hooks/useQueryLang';

const WORDS_LENGTH = 5;

const fetchWordsList = async (lang: string): Promise<string[]> => {
  const wordsJson = lang === 'es' ? '/data/es.json' : '/data/en.json';
  return fetch(`${window.location.pathname}${wordsJson}`)
    .then((r) => r.json())
    .then((list) => list.words.map((w: string) => w.toUpperCase()));
};

const App: React.FC = () => {
  const { lang } = useQueryLang(window.location.search);
  const query = useQuery<string[]>(
    ['wordsList', lang],
    () => fetchWordsList(lang),
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
    </>
  );
};

export default App;
