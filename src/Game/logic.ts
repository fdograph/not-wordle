export const langKeyboard = {
  en: [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['Enter', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace'],
  ],

  es: [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ñ'],
    ['Enter', 'x', 'c', 'v', 'b', 'n', 'm', 'Borrar'],
  ],
};

// only single letters allowed (a-z|A-Z)
export const isAllowedLetter = (s: string) =>
  s.length === 1 && /[a-zñ]/gi.test(s);

export const selectWord = (list: string[]) => {
  const word = list[~~(list.length * Math.random())];
  const chars = word.split('').reduce((map, char) => {
    const count = map.get(char) ?? 0;

    map.set(char, count + 1);
    return map;
  }, new Map<string, number>());

  return {
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

  return 'neutral';
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
        .map((c, idx) => {
          switch (statusMap[idx].status) {
            case 'correct':
              return '🟩';
            case 'found':
              return '🟨';
            default:
              return '⬛';
          }
        })
        .join('');
    })
    .join('\n');

  return bodyText + '\n\n' + playBlocks;
};

export const copyToClipboard = (text: string) =>
  navigator.clipboard.writeText(text);
