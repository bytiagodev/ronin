import { useRef, useState } from 'react';
import { historicalEras } from '../data/context.js';

export default function HistoricalContext() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef([]);
  function handleKey(event, currentIndex) {
    let nextIndex;
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % historicalEras.length;
    else if (event.key === 'ArrowLeft')
      nextIndex = (currentIndex - 1 + historicalEras.length) % historicalEras.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = historicalEras.length - 1;
    else return;
    event.preventDefault();
    setActiveIndex(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  }
  return (
    <section id="world" className="world-section section-shell" aria-labelledby="world-title">
      <div className="section-heading">
        <h2 id="world-title">His Japan</h2>
        <p>The wars, settlements and households that shaped the choices available to him.</p>
      </div>
      <div className="era-tabs" role="tablist" aria-label="Events shaping Musashi’s life">
        {historicalEras.map((era, index) => (
          <button
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            key={era.id}
            role="tab"
            id={`era-tab-${era.id}`}
            aria-controls={`era-panel-${era.id}`}
            aria-selected={activeIndex === index}
            tabIndex={activeIndex === index ? 0 : -1}
            onClick={() => setActiveIndex(index)}
            onKeyDown={(event) => handleKey(event, index)}
          >
            <span>{era.year}</span>
            <span>{era.period}</span>
          </button>
        ))}
      </div>
      {historicalEras.map((era, index) => (
        <div
          className="era-panel"
          key={era.id}
          id={`era-panel-${era.id}`}
          role="tabpanel"
          aria-labelledby={`era-tab-${era.id}`}
          hidden={activeIndex !== index}
          tabIndex={0}
        >
          <h3>{era.title}</h3>
          {era.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <a className="editorial-link" href={era.source.url} target="_blank" rel="noreferrer">
            {era.source.title}
          </a>
        </div>
      ))}
    </section>
  );
}
