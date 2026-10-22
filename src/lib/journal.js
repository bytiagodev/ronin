export const journalStorageKey = 'ronin.reflections.v1';

export function readReflections(storage) {
  try {
    const savedEntries = JSON.parse(storage.getItem(journalStorageKey) || '[]');
    if (!Array.isArray(savedEntries)) return [];
    return savedEntries.filter(
      (entry) =>
        entry &&
        typeof entry.id === 'string' &&
        typeof entry.text === 'string' &&
        entry.text.trim() &&
        typeof entry.element === 'string' &&
        typeof entry.createdAt === 'string',
    );
  } catch {
    return [];
  }
}

export function createReflection(text, element, id, createdAt) {
  const trimmedText = text.trim();
  if (!trimmedText || trimmedText.length > 2000) return null;
  return { id, text: trimmedText, element, createdAt };
}

export function exportReflections(entries) {
  return [
    'RŌNIN / Personal reflections',
    '',
    ...entries.map(
      (entry) =>
        `${entry.element} · ${new Date(entry.createdAt).toLocaleDateString('en-GB')}\n${entry.text}\n`,
    ),
  ].join('\n');
}
