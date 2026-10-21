import { profiles } from '../data/profiles.js';

export default function People() {
  return (
    <section id="people" className="people-section section-shell" aria-labelledby="people-title">
      <div className="section-heading">
        <h2 id="people-title">The people in his story</h2>
        <p>A rival, a patron, an adopted son and the rulers whose wars shaped his lifetime.</p>
      </div>
      <div className="people-grid">
        {profiles.map((person) => (
          <a
            className={`people-card ${person.artwork ? 'has-artwork' : 'text-only'}`}
            href={`#people/${person.id}`}
            key={person.id}
          >
            {person.artwork && (
              <img
                src={person.artwork.src}
                alt={person.artwork.alt}
                width={person.artwork.width}
                height={person.artwork.height}
                loading="lazy"
                style={{ objectPosition: person.artwork.position || 'center' }}
              />
            )}
            <div>
              <p className="person-role">{person.role}</p>
              <h3>{person.name}</h3>
              <p className="person-dates">{person.years}</p>
              <p>{person.cardDescription}</p>
              <span className="editorial-link">Read about {person.name.split(' ').at(-1)}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
