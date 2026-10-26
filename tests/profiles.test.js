import test from 'node:test';
import assert from 'node:assert/strict';
import { people, peopleSources } from '../src/data/people.js';
import { profiles, findProfile } from '../src/data/profiles.js';

function assertText(value, description) {
  assert.equal(typeof value, 'string', description);
  assert.ok(value.trim(), description);
}

test('the collection contains exactly the five people needed to explain Musashi’s story', () => {
  const requiredIds = ['nobunaga', 'ieyasu', 'kojiro', 'tadatoshi', 'iori'];
  assert.deepEqual(people.map((person) => person.id).sort(), [...requiredIds].sort());
  assert.equal(new Set(profiles.map((profile) => profile.id)).size, requiredIds.length);
  assert.deepEqual(profiles.map((profile) => profile.id).sort(), [...requiredIds].sort());
  for (const person of people) {
    assert.equal(findProfile(person.id)?.name, person.name);
    for (const field of [
      'name',
      'kanji',
      'years',
      'role',
      'description',
      'cardDescription',
      'epithet',
    ]) {
      assertText(person[field], `${person.id}: ${field}`);
    }
    assert.match(person.description, /Musashi/, `${person.id} needs a clear connection to Musashi`);
  }
  assert.equal(findProfile('unknown-person'), undefined);
});

test('people cards and profiles do not reuse complete narrative sentences', () => {
  const sentences = new Intl.Segmenter('en', { granularity: 'sentence' });
  for (const person of people) {
    const copy = [
      person.cardDescription,
      person.description,
      ...person.introduction,
      ...person.sections.flatMap((section) => section.paragraphs),
      ...person.timeline.map((milestone) => milestone.description),
      ...person.legacy.paragraphs,
    ];
    const seen = new Set();
    for (const passage of copy) {
      for (const { segment } of sentences.segment(passage)) {
        const sentence = segment.trim();
        assert.ok(!seen.has(sentence), `${person.id}: repeated sentence: ${sentence}`);
        seen.add(sentence);
      }
    }
  }
});

test('short people profiles have complete facts, two or three chapters, and a useful chronology', () => {
  for (const profile of profiles) {
    assert.ok(profile.introduction.length >= 1 && profile.introduction.length <= 2, profile.id);
    assert.equal(profile.facts.length, 4, profile.id);
    assert.equal(new Set(profile.facts.map((fact) => fact.label)).size, profile.facts.length);
    for (const fact of profile.facts) {
      assertText(fact.label, `${profile.id}: fact label`);
      assertText(fact.value, `${profile.id}: ${fact.label}`);
    }
    assert.ok(profile.sections.length >= 2 && profile.sections.length <= 3, profile.id);
    assert.equal(
      new Set(profile.sections.map((section) => section.id)).size,
      profile.sections.length,
    );
    for (const section of profile.sections) {
      assertText(section.id, `${profile.id}: chapter identifier`);
      assertText(section.title, `${profile.id}: chapter title`);
      assert.equal(section.paragraphs.length, 2, `${profile.id}: ${section.title}`);
      for (const paragraph of section.paragraphs)
        assertText(paragraph, `${profile.id}: empty chapter`);
    }
    assert.ok(profile.timeline.length >= 3 && profile.timeline.length <= 5, profile.id);
    for (const milestone of profile.timeline) {
      for (const field of ['year', 'title', 'description'])
        assertText(milestone[field], `${profile.id}: chronology ${field}`);
    }
    assertText(profile.legacy.title, `${profile.id}: legacy heading`);
    assert.equal(profile.legacy.paragraphs.length, 1);
    for (const paragraph of [...profile.introduction, ...profile.legacy.paragraphs])
      assertText(paragraph, `${profile.id}: narrative`);
  }
});

test('every people chapter cites its own supporting records with valid HTTPS source links', () => {
  const allSourceIds = peopleSources.map((source) => source.id);
  assert.equal(new Set(allSourceIds).size, allSourceIds.length);
  for (const profile of profiles) {
    assert.ok(profile.sources.length > 0, profile.id);
    const ownSourceIds = new Set(profile.sources.map((source) => source.id));
    for (const source of profile.sources) {
      assertText(source.id, 'Source identifier');
      assertText(source.title, `${source.id}: title`);
      assertText(source.note, `${source.id}: context`);
      assert.equal(new URL(source.url).protocol, 'https:', source.id);
    }
    for (const section of profile.sections) {
      assert.ok(section.sourceIds.length > 0, `${profile.id}: ${section.title}`);
      for (const sourceId of section.sourceIds)
        assert.ok(ownSourceIds.has(sourceId), `${profile.id}: missing ${sourceId}`);
    }
    // Sources are shown where they are used, so each one must be cited by a section or the chronology.
    const citedSourceIds = new Set([
      ...profile.sections.flatMap((section) => section.sourceIds),
      ...(profile.timelineSourceIds ?? []),
    ]);
    for (const sourceId of ownSourceIds)
      assert.ok(citedSourceIds.has(sourceId), `${profile.id}: ${sourceId} is never shown`);
  }
});

test('related-reading links resolve to distinct people rather than returning to the same profile', () => {
  for (const profile of profiles) {
    assert.equal(profile.relatedIds.length, 2, profile.id);
    assert.equal(new Set(profile.relatedIds).size, profile.relatedIds.length);
    for (const personId of profile.relatedIds) {
      assert.notEqual(personId, profile.id);
      assert.ok(findProfile(personId), `${profile.id}: missing related person ${personId}`);
    }
  }
});
