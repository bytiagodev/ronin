export default function Icon({ name = 'arrow', size = 20, ...props }) {
  const paths = {
    arrow: (
      <>
        <path d="M4 12h15M13 5l7 7-7 7" />
      </>
    ),
    diagonal: (
      <>
        <path d="M5 19 19 5M5 5h14v14" />
      </>
    ),
    bookmark: <path d="M6 4h12v17l-6-4-6 4V4Z" />,
    close: (
      <>
        <path d="m6 6 12 12M6 18 18 6" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 5 5" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    download: (
      <>
        <path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}

export function Crest({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="17" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M10 27 27 10M14 31 31 14M12 14l14 14M9 17l14 14"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="m23 8 9 9M8 23l9 9" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
