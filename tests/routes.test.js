import test from 'node:test';
import assert from 'node:assert/strict';
import { readPageRoute } from '../src/lib/routes.js';
import { profiles, findProfile } from '../src/data/profiles.js';

test('each person has a direct hash address that resolves to their profile', () => {
  for (const profile of profiles) {
    const route = readPageRoute(`#people/${profile.id}`);
    assert.deepEqual(route, { kind: 'profile', personId: profile.id });
    assert.equal(findProfile(route.personId), profile);
    assert.deepEqual(readPageRoute(`#people/${profile.id}/`), route);
  }
});

test('homepage links preserve the page-order destinations and a blank address opens the hero', () => {
  for (const anchor of [
    'home',
    'life',
    'five-rings',
    'people',
    'world',
    'reading-room',
    'main-content',
  ]) {
    assert.deepEqual(readPageRoute(`#${anchor}`), { kind: 'home', anchor });
  }
  assert.deepEqual(readPageRoute(''), { kind: 'home', anchor: 'home' });
  assert.deepEqual(readPageRoute('#'), { kind: 'home', anchor: 'home' });
});

test('a previously shared Musashi profile address now leads to his continuous life', () => {
  assert.deepEqual(readPageRoute('#warriors/musashi'), { kind: 'home', anchor: 'life' });
  assert.deepEqual(readPageRoute('#musashi'), { kind: 'home', anchor: 'life' });
});

test('an unknown person remains distinguishable so the missing-profile view can offer recovery', () => {
  const route = readPageRoute('#people/unknown-person');
  assert.deepEqual(route, { kind: 'profile', personId: 'unknown-person' });
  assert.equal(findProfile(route.personId), undefined);
  assert.deepEqual(readPageRoute('#people'), { kind: 'home', anchor: 'people' });
});

test('incomplete or malformed people addresses recover to the people section', () => {
  for (const address of [
    '#people/',
    '#people//iori',
    '#people/iori/extra',
    '#people/iori//extra',
  ]) {
    assert.deepEqual(readPageRoute(address), { kind: 'home', anchor: 'people' }, address);
  }
});

test('an unrecognized homepage fragment never opens an unrelated person', () => {
  assert.deepEqual(readPageRoute('#unknown-chapter'), { kind: 'home', anchor: 'unknown-chapter' });
});
