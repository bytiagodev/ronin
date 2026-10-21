export default function MusashiQuote({ quote }) {
  return (
    <figure className="musashi-quote">
      <blockquote>
        <p className="quote-japanese" lang="ja">
          {quote.japanese}
        </p>
        <p className="quote-translation">{quote.translation}</p>
      </blockquote>
      <figcaption>
        <a href={quote.sourceUrl} target="_blank" rel="noreferrer">
          {quote.work}
        </a>
        <span>Translation for this site.</span>
      </figcaption>
    </figure>
  );
}
