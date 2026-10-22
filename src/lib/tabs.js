// Arrow, Home and End keys for tab lists, following the WAI-ARIA tabs pattern.
export function nextTabIndex(key, currentIndex, tabCount) {
  switch (key) {
    case 'ArrowRight':
    case 'ArrowDown':
      return (currentIndex + 1) % tabCount;
    case 'ArrowLeft':
    case 'ArrowUp':
      return (currentIndex - 1 + tabCount) % tabCount;
    case 'Home':
      return 0;
    case 'End':
      return tabCount - 1;
    default:
      return null;
  }
}
