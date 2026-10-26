import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { heroCopy, lifeChapters, lifeSources, evidenceNote } from '../src/data/musashi.js';
import { historicalEras } from '../src/data/context.js';
import { people } from '../src/data/people.js';
import { rings } from '../src/data/rings.js';
import { glossary, readingSources } from '../src/data/reading.js';
import { artworks } from '../src/data/artworks.js';
import { musashiQuotes } from '../src/data/quotes.js';

function assertText(value, description) {
  assert.equal(typeof value, 'string', description);
  assert.ok(value.trim(), description);
}

function webpDimensions(imageBytes) {
  assert.equal(imageBytes.subarray(0, 4).toString(), 'RIFF');
  assert.equal(imageBytes.subarray(8, 12).toString(), 'WEBP');
  for (let chunkOffset = 12; chunkOffset + 8 <= imageBytes.length;) {
    const chunkType = imageBytes.toString('ascii', chunkOffset, chunkOffset + 4);
    const chunkLength = imageBytes.readUInt32LE(chunkOffset + 4);
    const dataOffset = chunkOffset + 8;
    assert.ok(dataOffset + chunkLength <= imageBytes.length, 'WebP chunk must fit inside the file');
    if (chunkType === 'VP8X') {
      return {
        width: 1 + imageBytes.readUIntLE(dataOffset + 4, 3),
        height: 1 + imageBytes.readUIntLE(dataOffset + 7, 3),
      };
    }
    if (chunkType === 'VP8 ') {
      assert.equal(imageBytes.subarray(dataOffset + 3, dataOffset + 6).toString('hex'), '9d012a');
      return {
        width: imageBytes.readUInt16LE(dataOffset + 6) & 0x3fff,
        height: imageBytes.readUInt16LE(dataOffset + 8) & 0x3fff,
      };
    }
    if (chunkType === 'VP8L') {
      assert.equal(imageBytes[dataOffset], 0x2f);
      const packedDimensions = imageBytes.readUInt32LE(dataOffset + 1);
      return {
        width: 1 + (packedDimensions & 0x3fff),
        height: 1 + ((packedDimensions >>> 14) & 0x3fff),
      };
    }
    chunkOffset = dataOffset + chunkLength + (chunkLength % 2);
  }
  throw new Error('No WebP image dimensions found');
}

test('the continuous life contains nine distinct navigable chapters with complete narrative', () => {
  assert.equal(lifeChapters.length, 9);
  assert.equal(new Set(lifeChapters.map((chapter) => chapter.id)).size, lifeChapters.length);
  for (const chapter of lifeChapters) {
    for (const field of ['id', 'year', 'title'])
      assertText(chapter[field], `${chapter.id}: ${field}`);
    assert.ok(chapter.paragraphs.length >= 2 && chapter.paragraphs.length <= 4, chapter.id);
    for (const paragraph of chapter.paragraphs)
      assertText(paragraph, `${chapter.id}: empty paragraph`);
  }
});

test('every life chapter and the attributed duel claim resolve to named supporting sources', () => {
  const sourcesById = new Map(lifeSources.map((source) => [source.id, source]));
  assert.equal(sourcesById.size, lifeSources.length);
  for (const source of lifeSources) {
    assertText(source.id, 'Source identifier');
    assertText(source.title, `${source.id}: title`);
    assertText(source.note, `${source.id}: source context`);
    assert.equal(new URL(source.url).protocol, 'https:', source.id);
  }
  for (const chapter of lifeChapters) {
    assert.ok(chapter.sourceIds.length > 0, `${chapter.id} needs evidence`);
    for (const sourceId of chapter.sourceIds)
      assert.ok(sourcesById.has(sourceId), `${chapter.id}: ${sourceId}`);
  }
  assert.ok(sourcesById.has(heroCopy.sourceId));
  assert.match(heroCopy.lead, /own count/i);
  assert.match(evidenceNote, /1582/);
  assert.match(evidenceNote, /1584/);
  assert.match(evidenceNote, /Ganryūjima/);
});

test('the timeline dates remain in order through the painting and writing chapters', () => {
  const dates = lifeChapters.map((chapter) => chapter.chronologyYear);
  assert.ok(dates.every(Number.isInteger));
  assert.deepEqual(
    dates,
    [...dates].sort((earlier, later) => earlier - later),
  );
  assert.equal(lifeChapters.find((chapter) => chapter.id === 'brush').year, '1640-43');
  const narrative = lifeChapters.flatMap((chapter) => chapter.paragraphs).join(' ');
  assert.doesNotMatch(narrative, /sixty|1582 and 1584|birth.*disput/i);
});

test('eight chapters have Japanese excerpts, original English renderings and named sources', () => {
  assert.deepEqual(
    Object.keys(musashiQuotes),
    lifeChapters.filter((chapter) => chapter.id !== 'kumamoto').map((chapter) => chapter.id),
  );
  assert.equal(new Set(Object.values(musashiQuotes).map((quote) => quote.japanese)).size, 8);
  assert.equal(musashiQuotes.kumamoto, undefined);
  for (const [chapterId, quote] of Object.entries(musashiQuotes)) {
    for (const field of ['japanese', 'translation', 'work'])
      assertText(quote[field], `${chapterId}: ${field}`);
    assert.match(quote.japanese, /[\p{Script=Han}\p{Script=Hiragana}]/u);
    assert.equal(new URL(quote.sourceUrl).protocol, 'https:');
    assert.match(quote.work, /164[3-5]/);
  }
  assert.match(musashiQuotes.beginning.japanese, /十三歳/);
  assert.match(musashiQuotes.kyoto.work, /Water Scroll: fighting many opponents/);
  assert.equal(musashiQuotes.kyoto.sourceUrl, 'https://www.koten.net/gorin/gen/234/');
  assert.match(musashiQuotes.death.work, /Dokkōdō/);
});

test('His Japan contains only the five turning points directly shaping Musashi’s lifetime', () => {
  assert.deepEqual(
    historicalEras.map((era) => era.year),
    ['1582', '1600', '1614-15', '1637-38', '1640s'],
  );
  assert.equal(new Set(historicalEras.map((era) => era.id)).size, historicalEras.length);
  const knownPeople = new Set(people.map((person) => person.id));
  for (const era of historicalEras) {
    assertText(era.period, `${era.id}: period`);
    assertText(era.title, `${era.id}: title`);
    assert.equal(era.paragraphs.length, 2);
    for (const paragraph of era.paragraphs) assertText(paragraph, `${era.id}: narrative`);
    assert.match(era.paragraphs.join(' '), /Musashi/, `${era.id} must explain his surroundings`);
    assert.ok(
      era.relatedIds.every((personId) => knownPeople.has(personId)),
      era.id,
    );
    assertText(era.source.title, `${era.id}: source title`);
    assert.equal(new URL(era.source.url).protocol, 'https:');
  }
});

test('all five scrolls retain their own interpretation and journal exercise', () => {
  assert.deepEqual(
    rings.map((ring) => ring.title),
    ['Earth', 'Water', 'Fire', 'Wind', 'Void'],
  );
  assert.equal(new Set(rings.map((ring) => ring.id)).size, rings.length);
  for (const ring of rings) {
    assert.equal(ring.paragraphs.length, 2);
    for (const field of ['kanji', 'subtitle', 'reflection', 'exercise'])
      assertText(ring[field], `${ring.id}: ${field}`);
  }
});

test('the reading room has distinct glossary terms and usable deduplicated source records', () => {
  assert.ok(glossary.length > 0);
  const terms = glossary.map((entry) => entry.term.trim().toLocaleLowerCase('en'));
  assert.equal(new Set(terms).size, terms.length);
  for (const entry of glossary) {
    assertText(entry.term, 'Glossary term');
    assertText(entry.definition, `${entry.term}: definition`);
  }
  assert.ok(readingSources.length > 0);
  assert.equal(new Set(readingSources.map((source) => source.url)).size, readingSources.length);
  for (const source of readingSources) {
    assertText(source.title, 'Reading-room source title');
    assertText(source.note, `${source.title}: context`);
    assert.equal(new URL(source.url).protocol, 'https:');
  }
});

test('every shipped artwork has a rights record and dimensions matching the actual WebP file', async () => {
  for (const [artworkId, artwork] of Object.entries(artworks)) {
    assert.match(artwork.src, /^\/images\/figures\/[a-z-]+\.webp$/, artworkId);
    for (const field of ['alt', 'title', 'artist', 'date', 'institution', 'caption', 'license']) {
      assertText(artwork[field], `${artworkId}: ${field}`);
    }
    assert.equal(new URL(artwork.sourceUrl).protocol, 'https:');
    assert.equal(new URL(artwork.licenseUrl).protocol, 'https:');
    assert.ok(Number.isInteger(artwork.width) && artwork.width > 0, artworkId);
    assert.ok(Number.isInteger(artwork.height) && artwork.height > 0, artworkId);
    const imageBytes = await readFile(new URL(`../public${artwork.src}`, import.meta.url));
    assert.deepEqual(
      webpDimensions(imageBytes),
      { width: artwork.width, height: artwork.height },
      artworkId,
    );
  }
  assert.equal(artworks.shrike.artist, 'Miyamoto Musashi');
  assert.match(artworks.shrike.title, /Shrike on a Withered Branch/);
});

test('published content uses plain hyphens instead of either prohibited dash character', () => {
  const publishedContent = JSON.stringify({
    heroCopy,
    lifeChapters,
    lifeSources,
    evidenceNote,
    historicalEras,
    people,
    rings,
    glossary,
    readingSources,
    artworks,
    musashiQuotes,
  });
  assert.equal(/[\u2013\u2014]/u.test(publishedContent), false);
});

test('the brush font subset covers every Japanese character the site sets in it', async () => {
  const subset = await readFile(
    new URL('../public/fonts/yuji-syuku-subset.txt', import.meta.url),
    'utf8',
  );
  const japanese = [
    ...Object.values(musashiQuotes).map((quote) => quote.japanese),
    ...rings.map((ring) => ring.kanji),
    ...people.map((person) => person.kanji),
    ...glossary.map((entry) => entry.kanji),
  ].join('');
  const missing = [...new Set(japanese)].filter((character) => !subset.includes(character));
  assert.deepEqual(missing, [], 'Run scripts/build-brush-font.py after adding Japanese text');
});
