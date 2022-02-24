import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { getParams } from './hooks/useQueryString';

const resources = {
  en: {
    translation: {
      appTitle: 'This is NOT Wordle',
      changeLanguageToText: 'ES {{targetLangFlag}}',
      changeLanguageToLabel: 'Jugar en Español',
      tweetBody: 'I just completed a NOT Wordle! {{turn}}/{{maxTurns}}',
      youAreaWinner: 'You are the Winner!',
      youAreaLooser: 'You Loose :(',
      finalBoardBodyCopy:
        'Thank you for playing! You can try again by refreshing this page',
      copyToClipboard: 'Copy results to clipboard',
      tweetYourScore: 'Tweet your score!',
      copySuccessful: 'Your score was copied to your clipboard',
      viewOnGithub: 'View code on Github',
    },
  },
  es: {
    translation: {
      appTitle: 'Esto NO es Wordle',
      changeLanguageToText: 'EN {{targetLangFlag}}',
      changeLanguageToLabel: 'Play in English',
      tweetBody: 'Acabo de completar este NO Wordle! {{turn}}/{{maxTurns}}',
      youAreaWinner: 'Has Ganado!',
      youAreaLooser: 'Perdiste el juego :(',
      finalBoardBodyCopy:
        'Gracias por jugar! Puedes intentar nuevamente refrescando la página',
      copyToClipboard: 'Copia tus resultados',
      tweetYourScore: 'Twitea tus resultados!',
      copySuccessful: 'Resultados copiados',
      viewOnGithub: 'Ver código en Github',
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    detection: {
      htmlTag: document.documentElement,
      lookupQuerystring: 'lang',
    },
    // lookupQuerystring: 'lang',
    // lng: queryLang === 'es' ? 'es' : 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
