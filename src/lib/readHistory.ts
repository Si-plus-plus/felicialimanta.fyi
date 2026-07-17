const STORAGE_KEY = 'felicialimanta_read_articles';

/**
 * Retrieves the array of read article slugs from localStorage.
 * Safe to call during SSR.
 */
export function getReadArticles(): string[] {
	if (typeof window === 'undefined') return [];

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			return JSON.parse(stored);
		}
	} catch (e) {
		console.warn('Failed to parse read history from localStorage', e);
	}
	return [];
}

/**
 * Marks a specific article slug as read by storing it in localStorage.
 * Deduplicates the slug if it already exists.
 */
export function markAsRead(slug: string): void {
	if (typeof window === 'undefined') return;

	try {
		const readArticles = getReadArticles();
		if (!readArticles.includes(slug)) {
			readArticles.push(slug);
			localStorage.setItem(STORAGE_KEY, JSON.stringify(readArticles));
		}
	} catch (e) {
		console.warn('Failed to save read history to localStorage', e);
	}
}
