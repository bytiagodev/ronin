export const journalStorageKey = 'ronin.reflections.v1';
export const reflectionMaxLength = 2000;

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
  if (!trimmedText || trimmedText.length > reflectionMaxLength) return null;
  return { id, text: trimmedText, element, createdAt };
}

export function exportReflections(entries) {
  return [
    'RŌNIN / Journal',
    '',
    ...entries.map(
      (entry) =>
        `${entry.element} · ${new Date(entry.createdAt).toLocaleDateString('en-GB')}\n${entry.text}\n`,
    ),
  ].join('\n');
}
