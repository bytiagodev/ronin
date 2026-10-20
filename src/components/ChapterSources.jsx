export default function ChapterSources({ sources }) {
  return (
    <details className="chapter-sources">
      <summary>Sources ({sources.length})</summary>
      <ul>
        {sources.map((source) => (
          <li key={source.id}>
            <a href={source.url} target="_blank" rel="noreferrer">
              {source.title}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
