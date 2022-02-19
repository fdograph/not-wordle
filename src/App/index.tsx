import React from 'react';

import { Header } from './components/Header';
import { Game } from '../Game';
import { useQuery } from 'react-query';

import Styles from './App.module.css';

const WORDS_LENGTH = 5;

const fetchWordsList = async (): Promise<string[]> => {
  return fetch('data/words.json')
    .then((r) => r.json())
    .then((list) => list.words.map((w: string) => w.toUpperCase()));
};

const App: React.FC = () => {
  const query = useQuery<string[]>('wordsList', fetchWordsList, {
    refetchIntervalInBackground: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

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
