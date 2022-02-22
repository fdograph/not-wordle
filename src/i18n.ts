import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      appTitle: 'This is NOT Wordle',
      changeLanguageToText: 'ES',
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
      changeLanguageToText: 'EN',
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
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',

    // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
