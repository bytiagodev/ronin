import { useEffect, useState } from 'react';
import Icon, { Crest } from './components/Icon.jsx';
import Artwork from './components/Artwork.jsx';
import { artworks } from './data/artworks.js';

const navigation = [
  { id: 'life', label: 'His life' },
  { id: 'five-rings', label: 'The five scrolls' },
  { id: 'people', label: 'The people in his story' },
  { id: 'world', label: 'His Japan' },
  { id: 'reading-room', label: 'Reading room' },
];

function Header({ profileOpen }) {
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
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Hero />
      </main>
      <Footer />
    </>
  );
}
