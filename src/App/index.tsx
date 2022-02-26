import React, { useMemo } from 'react';

import { Header } from './components/Header';
import { Game } from '../Game/Game';
import { useQuery } from 'react-query';

import Styles from './App.module.css';
import { Footer } from './components/Footer';
import { useTranslation } from 'react-i18next';
import { processWord } from '../Game/logic';

const WORDS_LENGTH = 5;
const MAX_TURNS = 6;

const fetchWordsList = async (lang: string) => {
  const wordsJson = lang === 'es' ? '/data/es.json' : '/data/en.json';
  return fetch(`${window.location.origin}${wordsJson}`)
    .then((r) => r.json() as Promise<{ words: string[] }>)
    .then((list) => list.words.map((w: string) => w.toUpperCase()));
};

const App: React.FC = () => {
  const { i18n, t } = useTranslation();
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
  const selection = useMemo(
    () => (query.isLoading ? null : processWord(query.data || [])),
    [query.data, query.isLoading]
  );

  return query.isLoading || selection === null ? (
    <div className={Styles.loadingWrapper} title={t('loading')}>
      <div className={Styles.spinner} />
    </div>
  ) : (
    <>
      <Header />
      <Game
        word={selection.word}
        wordsSet={selection.wordSet}
        wordCharMap={selection.chars}
        wordsLength={WORDS_LENGTH}
        maxTurns={MAX_TURNS}
      />
      <Footer />
    </>
  );
};

export default App;
