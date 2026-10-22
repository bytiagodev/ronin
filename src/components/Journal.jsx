import { useState } from 'react';
import Modal from './Modal.jsx';
import Icon from './Icon.jsx';
import {
  createReflection,
  exportReflections,
  journalStorageKey,
  readReflections,
  reflectionMaxLength,
} from '../lib/journal.js';
import { rings } from '../data/rings.js';

export default function Journal({ onClose, initialElement = 'Earth' }) {
  const [entries, setEntries] = useState(() => {
    try {
      return readReflections(window.localStorage);
    } catch {
      return [];
    }
  });
  const [reflection, setReflection] = useState('');
  const [element, setElement] = useState(initialElement);
  const [status, setStatus] = useState('');

  function persistEntries(nextEntries) {
    try {
      window.localStorage.setItem(journalStorageKey, JSON.stringify(nextEntries));
      setEntries(nextEntries);
      return true;
    } catch {
      setStatus('Your browser could not save this note. Copy it somewhere safe and try again.');
      return false;
    }
  }

  function saveReflection(event) {
    event.preventDefault();
    const nextEntry = createReflection(
      reflection,
      element,
      crypto.randomUUID(),
      new Date().toISOString(),
    );
    if (!nextEntry) {
      setStatus('Write a reflection before saving.');
      return;
    }
    if (persistEntries([nextEntry, ...entries])) {
      setReflection('');
      setStatus('Reflection saved on this device.');
    }
  }

  function downloadJournal() {
    const downloadUrl = URL.createObjectURL(
      new Blob([exportReflections(entries)], { type: 'text/plain;charset=utf-8' }),
    );
    const downloadLink = document.createElement('a');
    downloadLink.href = downloadUrl;
    downloadLink.download = 'ronin-journal.txt';
    downloadLink.click();
    // Safari can cancel the download if the URL is revoked in the same task.
    setTimeout(() => URL.revokeObjectURL(downloadUrl));
  }

  return (
    <Modal title="Your journal" onClose={onClose} className="journal-modal">
      <p className="modal-intro">
        Save a question or observation from your reading. Entries stay in this browser on this
        device.
      </p>
      <form onSubmit={saveReflection} className="journal-form">
        <label htmlFor="reflection-element">A perspective to write from</label>
        <select
          id="reflection-element"
          value={element}
          onChange={(event) => setElement(event.target.value)}
        >
          {rings.map((ring) => (
            <option key={ring.id}>{ring.title}</option>
          ))}
        </select>
        <label htmlFor="reflection-text">Your reflection</label>
        <textarea
          id="reflection-text"
          placeholder="What is one thing you could approach differently?"
          value={reflection}
          onChange={(event) => setReflection(event.target.value)}
          maxLength={reflectionMaxLength}
          rows={4}
          required
        />
        <div className="journal-form-footer">
          <span>
            {reflection.length} / {reflectionMaxLength}
          </span>
          <button className="button button-red" type="submit">
            Save reflection <Icon name="bookmark" size={16} />
          </button>
        </div>
      </form>
      <p className="form-status" role="status">
        {status}
      </p>
      <div className="journal-entries-header">
        <h3>
          Your reflections <span>({entries.length})</span>
        </h3>
        {entries.length > 0 && (
          <button className="text-button" onClick={downloadJournal}>
            Export <Icon name="download" size={16} />
          </button>
        )}
      </div>
      {entries.length === 0 ? (
        <p className="empty-journal">You have no saved reflections.</p>
      ) : (
        <ul className="journal-entries">
          {entries.map((entry) => (
            <li key={entry.id}>
              <div className="entry-meta">
                <span>
                  {entry.element} / {new Date(entry.createdAt).toLocaleDateString('en-GB')}
                </span>
                <button
                  className="text-button"
                  aria-label={`Delete reflection: ${entry.text.slice(0, 35)}`}
                  onClick={() => {
                    if (persistEntries(entries.filter((savedEntry) => savedEntry.id !== entry.id)))
                      setStatus('Reflection deleted.');
                  }}
                >
                  Delete
                </button>
              </div>
              <p>{entry.text}</p>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
