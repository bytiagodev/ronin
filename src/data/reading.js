import { lifeSources } from './musashi.js';
import { people } from './people.js';
import { historicalEras } from './context.js';
import { ringSources } from './rings.js';

const sourceRecords = [
  ...lifeSources,
  ...people.flatMap((person) => person.sources),
  ...historicalEras.map((era) => ({
    ...era.source,
    note: 'Historical context for Musashi’s lifetime.',
  })),
  ...ringSources.map((source) => ({
    title: source.title,
    url: source.href,
    note: 'The text and its five scrolls.',
  })),
];
export const readingSources = [
  ...new Map(sourceRecords.map((source) => [source.url, source])).values(),
];
export const glossary = [
  {
    term: 'Rōnin',
    kanji: '浪人',
    definition:
      'A samurai without a serving lord. Musashi’s changing relationship with warrior households is part of his story.',
  },
  {
    term: 'Daimyō',
    kanji: '大名',
    definition:
      'A territorial lord. Hosokawa Tadatoshi ruled the domain that received Musashi in 1640.',
  },
  {
    term: 'Shōgun',
    kanji: '将軍',
    definition: 'The head of a military government. Tokugawa Ieyasu received the title in 1603.',
  },
  {
    term: 'Niten Ichi-ryū',
    kanji: '二天一流',
    definition:
      'The swordsmanship tradition associated with Musashi, including the practice of using a long and short sword together.',
  },
  {
    term: 'Gorin no Sho',
    kanji: '五輪書',
    definition:
      'The Book of Five Rings, Musashi’s strategy text in five scrolls: Earth, Water, Fire, Wind and Void.',
  },
  {
    term: 'Sumi-e',
    kanji: '墨絵',
    definition: 'Ink painting. Musashi’s surviving work includes birds, figures and landscapes.',
  },
  {
    term: 'Reigandō',
    kanji: '霊巌洞',
    definition: 'The cave near Kumamoto associated with the writing of the Five Rings.',
  },
];
