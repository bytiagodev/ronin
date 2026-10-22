import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createReflection,
  exportReflections,
  journalStorageKey,
  readReflections,
} from '../src/lib/journal.js';

const savedReflection = {
  id: 'reflection-earth',
  text: 'Learn the foundations before adding another technique.',
  element: 'Earth',
  createdAt: '2026-10-18T12:00:00.000Z',
};

function storageContaining(serializedEntries) {
  return {
    getItem(requestedKey) {
      assert.equal(requestedKey, journalStorageKey);
      return serializedEntries;
    },
  };
}

test('a new journal reads as empty and uses the versioned storage key', () => {
  assert.equal(journalStorageKey, 'ronin.reflections.v1');
  assert.deepEqual(readReflections(storageContaining(null)), []);
});

test('malformed or non-array storage does not prevent the journal from opening', () => {
  for (const invalidStorage of ['{broken', 'null', '{}', '42', '"a reflection"']) {
    assert.deepEqual(readReflections(storageContaining(invalidStorage)), []);
  }
});

test('unavailable browser storage falls back to an empty journal', () => {
  const unavailableStorage = {
    getItem() {
      throw new Error('Storage access denied');
    },
  };

  assert.deepEqual(readReflections(unavailableStorage), []);
  assert.deepEqual(readReflections(undefined), []);
});

test('invalid stored entries are skipped while valid reflections are recovered', () => {
  const invalidEntries = [
    null,
    'unfinished reflection',
    {},
    { ...savedReflection, id: 42 },
    { ...savedReflection, text: null },
    { ...savedReflection, text: ' \n\t ' },
    { ...savedReflection, element: undefined },
    { ...savedReflection, createdAt: 20261018 },
  ];
  const recoveredEntries = readReflections(
    storageContaining(
      JSON.stringify([invalidEntries[0], savedReflection, ...invalidEntries.slice(1)]),
    ),
  );

  assert.deepEqual(recoveredEntries, [savedReflection]);
});

test('new reflections trim surrounding whitespace and keep their selected scroll and metadata', () => {
  const reflection = createReflection(
    '  Notice what changes.\nKeep practicing. \n ',
    'Water',
    'reflection-water',
    savedReflection.createdAt,
  );

  assert.deepEqual(reflection, {
    id: 'reflection-water',
    text: 'Notice what changes.\nKeep practicing.',
    element: 'Water',
    createdAt: savedReflection.createdAt,
  });
});

test('empty and whitespace-only reflections cannot be saved', () => {
  for (const emptyText of ['', '   ', '\n\t\r\n']) {
    assert.equal(
      createReflection(emptyText, 'Earth', 'empty-entry', savedReflection.createdAt),
      null,
    );
  }
});

test('the 2000-character limit applies after trimming and rejects longer reflections', () => {
  const maximumLengthText = 'a'.repeat(2000);

  assert.equal(
    createReflection(
      ` \n${maximumLengthText}\n `,
      'Void',
      'maximum-entry',
      savedReflection.createdAt,
    )?.text,
    maximumLengthText,
  );
  assert.equal(
    createReflection('a'.repeat(2001), 'Void', 'oversized-entry', savedReflection.createdAt),
    null,
  );
});

test('text exports include each reflection, its scroll, and readable date in saved order', () => {
  const firstEntry = {
    ...savedReflection,
    createdAt: new Date(2026, 9, 18, 12).toISOString(),
  };
  const secondEntry = {
    id: 'reflection-wind',
    element: 'Wind',
    text: 'Compare two approaches.\nKeep one useful observation from each.',
    createdAt: new Date(2026, 9, 19, 12).toISOString(),
  };

  assert.equal(
    exportReflections([firstEntry, secondEntry]),
    'RŌNIN / Personal reflections\n\n' +
      'Earth · 18/10/2026\nLearn the foundations before adding another technique.\n\n' +
      'Wind · 19/10/2026\nCompare two approaches.\nKeep one useful observation from each.\n',
  );
});
