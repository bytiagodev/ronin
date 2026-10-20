import { lifeChapters, lifeSources, evidenceNote } from '../data/musashi.js';
import { artworks } from '../data/artworks.js';
import Artwork from './Artwork.jsx';
import ChapterSources from './ChapterSources.jsx';

const chapterArtwork = {
  kyoto: 'yoshioka',
  wandering: 'musashiPrint',
};

export default function MusashiLife() {
  return (
    <section id="life" className="life-section section-shell" aria-labelledby="life-title">
      <div className="section-heading">
        <h2 id="life-title">His life</h2>
        <p>From his first account of a duel to his final years in Kumamoto.</p>
      </div>
      <div className="life-layout">
        <div className="life-prose">
          {lifeChapters.map((chapter) => (
            <article
              key={chapter.id}
              id={`life-${chapter.id}`}
              data-chapter={chapter.id}
              className="life-chapter"
            >
              <p className="chapter-year">{chapter.year}</p>
              <h3 tabIndex={-1}>{chapter.title}</h3>
              {chapter.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <Artwork artwork={artworks[chapter.artworkId || chapterArtwork[chapter.id]]} />
              <ChapterSources
                sources={chapter.sourceIds
                  .map((sourceId) => lifeSources.find((source) => source.id === sourceId))
                  .filter(Boolean)}
              />
            </article>
          ))}
          <aside className="life-evidence">
            <h3>Where the accounts differ</h3>
            <p>{evidenceNote}</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
