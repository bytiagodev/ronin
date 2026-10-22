import { useRef, useState } from 'react';
import { rings, ringSources } from '../data/rings';

export default function FiveRings({ onWriteFromScroll }) {
  const [activeRingId, setActiveRingId] = useState(rings[0].id);
  const tabButtons = useRef([]);

  function handleTabKeyDown(event, currentIndex) {
    let nextIndex;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (currentIndex + 1) % rings.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (currentIndex - 1 + rings.length) % rings.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = rings.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    setActiveRingId(rings[nextIndex].id);
    tabButtons.current[nextIndex]?.focus();
  }

  return (
    <section
      id="five-rings"
      className="rings-section section-shell"
      aria-labelledby="rings-heading"
    >
      <h2 id="rings-heading">The five scrolls</h2>
      <p className="section-description">
        In <cite>The Book of Five Rings</cite>, Musashi sets out his approach to swordsmanship
        through Earth, Water, Fire, Wind and Void. These summaries follow the subjects of each
        scroll.
      </p>

      <div className="rings-layout">
        <div className="ring-tabs" role="tablist" aria-label="The five scrolls">
          {rings.map((ring, ringIndex) => (
            <button
              key={ring.id}
              ref={(button) => {
                tabButtons.current[ringIndex] = button;
              }}
              type="button"
              role="tab"
              id={`ring-tab-${ring.id}`}
              aria-controls={`ring-panel-${ring.id}`}
              aria-selected={activeRingId === ring.id}
              tabIndex={activeRingId === ring.id ? 0 : -1}
              className="ring-tab"
              data-active={activeRingId === ring.id}
              onClick={() => setActiveRingId(ring.id)}
              onKeyDown={(event) => handleTabKeyDown(event, ringIndex)}
            >
              <span className="ring-kanji" lang="ja" aria-hidden="true">
                {ring.kanji}
              </span>
              <span className="ring-tab-label">{ring.title}</span>
            </button>
          ))}
        </div>

        <div className="ring-panels">
          {rings.map((ring) => (
            <div
              key={ring.id}
              id={`ring-panel-${ring.id}`}
              role="tabpanel"
              aria-labelledby={`ring-tab-${ring.id}`}
              tabIndex={0}
              hidden={activeRingId !== ring.id}
              className="ring-panel"
            >
              <div className="ring-panel-heading">
                <div>
                  <h3>The Book of {ring.title}</h3>
                  <p className="ring-subtitle">{ring.subtitle}</p>
                </div>
                <span className="ring-panel-kanji" lang="ja" aria-hidden="true">
                  {ring.kanji}
                </span>
              </div>

              <div className="ring-body">
                {ring.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="ring-reflection">
                <h4>Consider this</h4>
                <p>{ring.reflection}</p>
              </div>
              <div className="ring-exercise">
                <h4>Try this</h4>
                <p>{ring.exercise}</p>
              </div>
              <button
                className="button button-dark scroll-journal-button"
                onClick={() => onWriteFromScroll(ring.title)}
              >
                Write from this scroll
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rings-source-note">
        <p>
          Original summaries of the historical text. Reflections and practices are modern
          interpretations, not Musashi’s instructions.
        </p>
        <p className="rings-source-links">
          {ringSources.map((source) => (
            <a key={source.href} href={source.href} target="_blank" rel="noreferrer">
              {source.title}
            </a>
          ))}
        </p>
      </div>
    </section>
  );
}
