interface KeyItem {
  val: string;
  label: string;
}

interface KeyboardMatrix {
  en: KeyItem[][];
  es: KeyItem[][];
}

const keyMapper = (key: string): KeyItem => ({
  val: key.toUpperCase(),
  label: key === 'Enter' ? '⏎' : key === 'Backspace' ? '⌫' : key,
});
export const langKeyboard: KeyboardMatrix = {
  en: [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'].map(keyMapper),
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'].map(keyMapper),
    ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace'].map(keyMapper),
  ],

  es: [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'].map(keyMapper),
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ñ'].map(keyMapper),
    ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace'].map(keyMapper),
  ],
};

export const isAllowedLetter = (s: string) =>
  s.length === 1 && /[a-zñ]/gi.test(s);

export const selectWord = (list: string[], language: string) => {
  const word = list[~~(list.length * Math.random())];
  const chars = word.split('').reduce((map, char) => {
    const count = map.get(char) ?? 0;

    map.set(char, count + 1);
    return map;
  }, new Map<string, number>());

  return {
    lang: language,
    word,
    chars,
  };
};

export const mapCorrect = (selectedWord: string, playerGuess: string[]) => {
  const correct = new Map<string, number>();

  playerGuess.forEach((c, idx) => {
    if (selectedWord[idx] === c) {
      correct.set(c, (correct.get(c) ?? 0) + 1);
    }
  });

  return correct;
};

export const getStatus = (
  idx: number,
  char: string,
  correct: Map<string, number>,
  repeatedMap: Map<string, number>,
  selectedWord: string,
  selectedCharMap: Map<string, number>
): 'correct' | 'found' | 'notFound' | 'neutral' => {
  if (!char) {
    return 'neutral';
  } else if (!selectedCharMap.get(char)) {
    return 'notFound';
  } else if (selectedWord[idx] === char) {
    return 'correct';
  }

  const correctCount = correct.get(char) ?? 0;
  const repeatedCount = repeatedMap.get(char) ?? 0;
  const selectedCount = selectedCharMap.get(char) ?? 0;
  const availCount = selectedCount - correctCount;

  if (correctCount === selectedCount) {
    return 'notFound';
  } else if (repeatedCount < availCount) {
    return 'found';
  }

  return 'notFound';
};

export const mapGuess = (
  row: string[],
  word: string,
  charMap: Map<string, number>
) => {
  const correct = mapCorrect(word, row);
  const repeatedCount = new Map<string, number>();

  return row.map((c, idx) => {
    const status = getStatus(
      idx,
      row[idx] ?? '',
      correct,
      repeatedCount,
      word,
      charMap
    );

    if (status === 'found') {
      repeatedCount.set(row[idx], (repeatedCount.get(row[idx]) ?? 0) + 1);
    }

    return { c, status };
  });
};

const statusBlockMap = {
  correct: '🟩',
  found: '🟨',
  notFound: '⬛',
  neutral: '⬛',
};

export const buildTweetText = (
  bodyText: string,
  plays: string[][],
  word: string,
  chars: Map<string, number>
) => {
  const playBlocks = plays
    .map((row) => {
      const statusMap = mapGuess(row, word, chars);
      return row
        .map((c, idx) => statusBlockMap[statusMap[idx].status])
        .join('');
    })
    .join('\n');

  return bodyText + '\n\n' + playBlocks + '\n\n' + window.location.href;
};

export const copyToClipboard = (text: string) =>
  navigator.clipboard.writeText(text);
