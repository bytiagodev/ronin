import { useEffect, useRef, useState } from 'react';
import { lifeChapters, lifeSources, evidenceNote } from '../data/musashi.js';
import { artworks } from '../data/artworks.js';
import Artwork from './Artwork.jsx';
import ChapterSources from './ChapterSources.jsx';

const chapterArtwork = {
  kyoto: 'yoshioka',
  wandering: 'musashiPrint',
};

export default function MusashiLife() {
  const [activeChapter, setActiveChapter] = useState(lifeChapters[0].id);
  const navigationRef = useRef(null);
  useEffect(() => {
    if (!window.matchMedia('(max-width: 760px)').matches) return;
    const navigation = navigationRef.current;
    const currentButton = navigation?.querySelector('[aria-current="step"]');
    if (!navigation || !currentButton) return;
    const buttonLeft =
      currentButton.getBoundingClientRect().left -
      navigation.getBoundingClientRect().left +
      navigation.scrollLeft;
    navigation.scrollTo({
      left: buttonLeft - (navigation.clientWidth - currentButton.clientWidth) / 2,
      behavior: 'instant',
    });
  }, [activeChapter]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      () => {
        const readingLine = window.innerHeight * 0.35;
        const currentChapter = lifeChapters.findLast((chapter) => {
          const element = document.getElementById(`life-${chapter.id}`);
          return element && element.getBoundingClientRect().top <= readingLine;
        });
        if (currentChapter) setActiveChapter(currentChapter.id);
      },
      { rootMargin: '-10% 0px -65% 0px' },
    );
    lifeChapters.forEach((chapter) => {
      const element = document.getElementById(`life-${chapter.id}`);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);
  function visitChapter(chapterId) {
    const chapter = document.getElementById(`life-${chapterId}`);
    chapter?.scrollIntoView();
    chapter?.querySelector('h3')?.focus({ preventScroll: true });
    setActiveChapter(chapterId);
  }
  return (
    <section id="life" className="life-section section-shell" aria-labelledby="life-title">
      <div className="section-heading">
        <h2 id="life-title">His life</h2>
        <p>From his first account of a duel to his final years in Kumamoto.</p>
      </div>
      <div className="life-layout">
        <nav
          ref={navigationRef}
          className="life-navigation"
          data-theme={activeChapter === 'ganryujima' ? 'ink' : 'paper'}
          aria-label="Musashi life timeline"
        >
          {lifeChapters.map((chapter) => (
            <button
              key={chapter.id}
              aria-current={activeChapter === chapter.id ? 'step' : undefined}
              onClick={() => visitChapter(chapter.id)}
            >
              <span>{chapter.year}</span>
              <span>{chapter.title}</span>
            </button>
          ))}
        </nav>
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
