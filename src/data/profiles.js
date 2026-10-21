import { people } from './people.js';
import { figureArtworks } from './artworks.js';

export const profiles = people.map((person) => ({ ...person, artwork: figureArtworks[person.id] }));
export function findProfile(personId) {
  return profiles.find((person) => person.id === personId);
}
