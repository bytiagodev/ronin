import { useEffect, useState } from 'react';
import Icon, { Crest } from './components/Icon.jsx';
import MusashiLife from './components/MusashiLife.jsx';
import FiveRings from './components/FiveRings.jsx';
import People from './components/People.jsx';
import HistoricalContext from './components/HistoricalContext.jsx';
import ProfilePage from './components/ProfilePage.jsx';
import Journal from './components/Journal.jsx';
import Artwork from './components/Artwork.jsx';
import { artworks } from './data/artworks.js';
import { findProfile } from './data/profiles.js';
import { glossary, readingSources } from './data/reading.js';
import { readPageRoute } from './lib/routes.js';

const navigation = [
  { id: 'life', label: 'His life' },
  { id: 'five-rings', label: 'The five scrolls' },
  { id: 'people', label: 'The people in his story' },
  { id: 'world', label: 'His Japan' },
  { id: 'reading-room', label: 'Reading room' },
];

function Header({ onOpenJournal, profileOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            setActiveSection(entry.target.id === 'home' ? '' : entry.target.id);
        });
      },
      { rootMargin: '-10% 0px -70% 0px' },
    );
    [{ id: 'home' }, ...navigation].forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === 'Escape') setMenuOpen(false);
    }
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);
  return (
    <header className="site-header">
      <a
        className="wordmark"
        href="#home"
        aria-label="Rōnin home"
        onClick={() => setMenuOpen(false)}
      >
        <Crest />
        <span>
          RŌNIN<span className="wordmark-dot">.</span>
        </span>
      </a>
      <nav
        id="main-navigation"
        className={`main-nav ${menuOpen ? 'is-open' : ''}`}
        aria-label="Main navigation"
      >
        {navigation.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={
              (profileOpen ? item.id === 'people' : activeSection === item.id)
                ? 'location'
                : undefined
            }
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <button
          className="journal-trigger"
          onClick={() => {
            setMenuOpen(false);
            onOpenJournal();
          }}
        >
          <Icon name="bookmark" size={17} />
          <span>My journal</span>
        </button>
        <button
          className="icon-button menu-toggle"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-controls="main-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Icon name={menuOpen ? 'close' : 'menu'} />
        </button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="hero section-shell" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">
          Miyamoto Musashi <span lang="ja">宮本武蔵</span>, c. 1584-1645
        </p>
        <h1 id="hero-title">By his own count, he won more than sixty duels.</h1>
        <p className="hero-contrast">He also painted this.</p>
        <p className="hero-description">
          Follow Musashi from his first duel at thirteen to his final years in Kumamoto. Meet his
          rivals and patrons, and see the paintings and writing he left behind.
        </p>
        <div className="hero-buttons">
          <a className="button button-red" href="#life">
            Start his story
          </a>
          <a className="editorial-link" href="#five-rings">
            Read the five scrolls
          </a>
        </div>
      </div>
      <Artwork artwork={artworks.shrike} className="hero-artwork" priority />
    </section>
  );
}

function ReadingRoom() {
  return (
    <section
      id="reading-room"
      className="reading-room section-shell"
      aria-labelledby="reading-title"
    >
      <div className="section-heading">
        <h2 id="reading-title">Reading room</h2>
        <p>Sources for Musashi’s life, his writing and the people around him.</p>
      </div>
      <div className="reading-layout">
        <div className="reading-note">
          <h3>Read Musashi alongside the records.</h3>
          <p>
            The opening of the Five Rings is his own account of his training and victories. Letters,
            surviving paintings and later memorials provide other views of the man. The sources
            below identify which kind of evidence supports each part of the story.
          </p>
          <a
            className="editorial-link"
            href="https://www.koten.net/gorin/"
            target="_blank"
            rel="noreferrer"
          >
            The Five Rings, Japanese text
          </a>
        </div>
        <div className="reading-accordions">
          <details>
            <summary>
              Terms in the story<span aria-hidden="true">+</span>
            </summary>
            <dl className="glossary">
              {glossary.map((entry) => (
                <div key={entry.term}>
                  <dt>
                    {entry.term} <span lang="ja">{entry.kanji}</span>
                  </dt>
                  <dd>{entry.definition}</dd>
                </div>
              ))}
            </dl>
          </details>
          <details>
            <summary>
              Sources and further reading<span aria-hidden="true">+</span>
            </summary>
            <ul className="sources-list">
              {readingSources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.title}
                  </a>
                  <p>{source.note}</p>
                </li>
              ))}
            </ul>
          </details>
          <details>
            <summary>
              About this site<span aria-hidden="true">+</span>
            </summary>
            <div className="about-guide">
              <p>
                RŌNIN follows Miyamoto Musashi’s life. The narrative uses original summaries of his
                writing and institutional sources. Accounts written after his death are considered
                alongside surviving documents, rather than treated as equally certain.
              </p>
              <p>
                Historical images are accompanied by captions identifying their makers, dates and
                source records. A later print is not an eyewitness account. All bundled artwork has
                a linked public-domain rights record.
              </p>
              <p>
                The scroll summaries paraphrase Musashi’s text. The reflection questions and
                exercises are modern interpretations, not quotations or martial instruction.
              </p>
              <p>
                Your journal is saved in this browser on this device. It has no account or server
                storage. Clearing site data removes the entries; use Export to keep a separate copy.
              </p>
              <p>No generated artwork is used.</p>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer section-shell">
      <a className="wordmark" href="#home">
        <Crest />
        <span>
          RŌNIN<span className="wordmark-dot">.</span>
        </span>
      </a>
      <p>Miyamoto Musashi: his life, paintings and writing.</p>
      <a className="editorial-link" href="#home">
        Back to the beginning
      </a>
    </footer>
  );
}

export default function App() {
  const [route, setRoute] = useState(() => readPageRoute(window.location.hash));
  const [journalRing, setJournalRing] = useState(null);
  const activeProfile = route.kind === 'profile' ? findProfile(route.personId) : null;
  useEffect(() => {
    function updateRoute() {
      setRoute(readPageRoute(window.location.hash));
    }
    window.addEventListener('hashchange', updateRoute);
    return () => window.removeEventListener('hashchange', updateRoute);
  }, []);
  useEffect(() => {
    document.title = activeProfile ? `${activeProfile.name} | RŌNIN` : 'RŌNIN | Miyamoto Musashi';
    const frame = requestAnimationFrame(() => {
      if (route.kind === 'profile') {
        window.scrollTo({ top: 0, behavior: 'instant' });
        document.getElementById('profile-title')?.focus({ preventScroll: true });
      } else if (route.anchor === 'home') {
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else {
        const destination = document.getElementById(route.anchor);
        destination?.scrollIntoView();
        if (route.anchor.startsWith('life-'))
          destination?.querySelector('h3')?.focus({ preventScroll: true });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [route, activeProfile]);
  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          const main = document.getElementById('main-content');
          main?.focus({ preventScroll: true });
          main?.scrollIntoView();
        }}
      >
        Skip to content
      </a>
      <Header
        onOpenJournal={() => setJournalRing('Earth')}
        profileOpen={route.kind === 'profile'}
      />
      <main id="main-content" tabIndex={-1}>
        <div hidden={route.kind !== 'home'}>
          <Hero />
          <MusashiLife />
          <FiveRings onWriteFromScroll={setJournalRing} />
          <People />
          <HistoricalContext />
          <ReadingRoom />
        </div>
        {activeProfile && <ProfilePage key={activeProfile.id} profile={activeProfile} />}
        {route.kind === 'profile' && !activeProfile && (
          <section className="missing-profile section-shell">
            <h1 id="profile-title" tabIndex={-1}>
              This person is not in the story.
            </h1>
            <p>Return to the people connected with Musashi.</p>
            <a className="button button-dark" href="#people">
              The people in his story
            </a>
          </section>
        )}
      </main>
      <Footer />
      {journalRing && <Journal initialElement={journalRing} onClose={() => setJournalRing(null)} />}
    </>
  );
}
