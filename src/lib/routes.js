export function readPageRoute(hash) {
  const segments = hash.replace(/^#/, '').replace(/\/$/, '').split('/');
  if (segments[0] === 'people' && segments[1] && segments.length === 2)
    return { kind: 'profile', personId: segments[1] };
  // Previously shared Musashi URLs now lead to the continuous homepage narrative.
  if (segments[0] === 'warriors' || segments[0] === 'musashi')
    return { kind: 'home', anchor: 'life' };
  return { kind: 'home', anchor: segments[0] || 'home' };
}
