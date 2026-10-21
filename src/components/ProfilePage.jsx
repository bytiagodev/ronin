import { profiles } from '../data/profiles.js';
import Artwork from './Artwork.jsx';
import ChapterSources from './ChapterSources.jsx';

const connections = {
  nobunaga: { chapter: 'beginning', label: 'Musashi’s early world' },
  ieyasu: { chapter: 'wandering', label: 'The wandering years' },
  kojiro: { chapter: 'ganryujima', label: 'The duel at Ganryūjima' },
  tadatoshi: { chapter: 'kumamoto', label: 'The invitation to Kumamoto' },
  iori: { chapter: 'shimabara', label: 'Musashi and Iori at Shimabara' },
};

function jumpToSection(sectionId) {
  const section = document.getElementById(sectionId);
  section?.scrollIntoView();
  section?.focus({ preventScroll: true });
}

export default function ProfilePage({ profile }) {
  const connection = connections[profile.id];
  const relatedProfiles = profile.relatedIds
    .map((personId) => profiles.find((person) => person.id === personId))
    .filter(Boolean);
  return (
    <article id="profile-article" className="profile-page">
      <div className="profile-breadcrumb section-shell">
        <a href="#life">Musashi’s life</a>
        <span>/</span>
        <a href="#people">The people in his story</a>
        <span>/</span>
        <span>{profile.name}</span>
      </div>
      <header className="profile-hero section-shell">
        <div className="profile-hero-copy">
          <p className="person-role">{profile.role}</p>
          <h1 id="profile-title" tabIndex={-1}>
            {profile.name}
          </h1>
          <div className="profile-identity">
            <span lang="ja">{profile.kanji}</span>
            <span>{profile.years}</span>
          </div>
          <p className="profile-standfirst">{profile.description}</p>
          <a className="editorial-link" href="#people">
            Back to the people in his story
          </a>
        </div>
        {profile.artwork ? (
          <Artwork artwork={profile.artwork} className="profile-artwork" priority />
        ) : (
          <aside className="profile-connection">
            <p className="eyebrow">In Musashi’s life</p>
            <h2>{profile.epithet}</h2>
            <a className="editorial-link" href={`#life-${connection.chapter}`}>
              {connection.label}
            </a>
          </aside>
        )}
      </header>
      <dl className="profile-facts section-shell">
        {profile.facts.map((fact) => (
          <div key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
      <div className="profile-reading-layout section-shell">
        <aside className="profile-contents">
          <nav aria-label="Profile contents">
            <button onClick={() => jumpToSection('profile-introduction')}>
              Connection to Musashi
            </button>
            {profile.sections.map((section) => (
              <button
                key={section.id}
                onClick={() => jumpToSection(`profile-section-${section.id}`)}
              >
                {section.title}
              </button>
            ))}
            <button onClick={() => jumpToSection('profile-chronology')}>Chronology</button>
            <button onClick={() => jumpToSection('profile-sources')}>Sources</button>
          </nav>
        </aside>
        <div className="profile-prose">
          <section className="profile-introduction">
            <h2 id="profile-introduction" tabIndex={-1}>
              Connection to Musashi
            </h2>
            {profile.introduction.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
          {profile.sections.map((section) => (
            <section className="profile-chapter" key={section.id}>
              <h2 id={`profile-section-${section.id}`} tabIndex={-1}>
                {section.title}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <ChapterSources
                sources={section.sourceIds
                  .map((sourceId) => profile.sources.find((source) => source.id === sourceId))
                  .filter(Boolean)}
              />
            </section>
          ))}
          <section className="profile-chronology">
            <h2 id="profile-chronology" tabIndex={-1}>
              Chronology
            </h2>
            <ol>
              {profile.timeline.map((milestone) => (
                <li key={`${milestone.year}-${milestone.title}`}>
                  <span>{milestone.year}</span>
                  <div>
                    <h3>{milestone.title}</h3>
                    <p>{milestone.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
          <section className="profile-legacy">
            <h2>{profile.legacy.title}</h2>
            {profile.legacy.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
          <section className="profile-sources">
            <h2 id="profile-sources" tabIndex={-1}>
              Sources
            </h2>
            <ul>
              {profile.sources.map((source) => (
                <li key={source.id}>
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.title}
                  </a>
                  <p>{source.note}</p>
                </li>
              ))}
            </ul>
          </section>
          <a className="button button-dark" href={`#life-${connection.chapter}`}>
            Return to Musashi’s story
          </a>
        </div>
      </div>
      {relatedProfiles.length > 0 && (
        <section className="profile-related section-shell">
          <h2>Connected people</h2>
          <div className="related-profiles">
            {relatedProfiles.map((person) => (
              <a key={person.id} href={`#people/${person.id}`}>
                <h3>{person.name}</h3>
                <p>{person.role}</p>
              </a>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
