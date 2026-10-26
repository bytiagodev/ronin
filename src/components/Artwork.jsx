export default function Artwork({ artwork, className = '', priority = false }) {
  if (!artwork) return null;
  return (
    <figure
      className={`artwork ${artwork.crop ? 'artwork-cropped' : ''} ${artwork.ink ? 'artwork-ink' : ''} ${className}`}
      style={artwork.ink ? { '--ink-lift': artwork.ink } : undefined}
    >
      <img
        src={artwork.src}
        alt={artwork.alt}
        width={artwork.width}
        height={artwork.height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        style={artwork.position ? { objectPosition: artwork.position } : undefined}
      />
      <figcaption>
        {artwork.caption}{' '}
        <a href={artwork.sourceUrl} target="_blank" rel="noreferrer">
          Source and rights record
        </a>
      </figcaption>
    </figure>
  );
}
