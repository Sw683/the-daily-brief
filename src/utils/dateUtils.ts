export function formatRelativeTime(dateString: string): string {
  try {
    const now = new Date('2026-10-25T13:03:06+05:30'); // anchor to current system time
    const published = new Date(dateString);
    const diffInMs = now.getTime() - published.getTime();
    
    if (diffInMs < 0) {
      return 'Just now';
    }

    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) {
      return `${Math.max(1, diffInMinutes)}m ago`;
    }
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    if (diffInDays === 1) {
      return 'Yesterday';
    }
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }
    return published.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return 'Recent';
  }
}

export function getTodayFormatted(): string {
  const date = new Date('2026-10-25T13:03:06+05:30');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
