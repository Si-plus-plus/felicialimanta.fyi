/** Comfortable prose pace used to estimate how long an article takes to read. */
export const WORDS_PER_MINUTE = 200;

/**
 * Length labels, short to long.
 * 4–7 stops before 8, so a post is only in one bucket.
 */
export const READING_LENGTH_TAGS = ['1-3 min', '4-7 min', '8+ min'] as const;

export type ReadingLengthTag = (typeof READING_LENGTH_TAGS)[number];

const READING_LENGTH_TAG_SET = new Set<string>(READING_LENGTH_TAGS);

export function isReadingLengthTag(tag: string): tag is ReadingLengthTag {
	return READING_LENGTH_TAG_SET.has(tag);
}

/**
 * Minutes a typical reader needs, rounded to the nearest minute.
 * A very short piece still counts as one minute.
 */
export function estimateReadingMinutes(markdown: string): number {
	const words = countWords(markdown);
	return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function readingLengthTag(minutes: number): ReadingLengthTag {
	if (minutes <= 3) return '1-3 min';
	if (minutes <= 7) return '4-7 min';
	return '8+ min';
}

/**
 * Words a reader actually sees. Fenced code, images, and URLs are left out;
 * link labels stay in.
 */
function countWords(markdown: string): number {
	const prose = markdown
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
		.replace(/\[([^\]]*)]\([^)]*\)/g, '$1')
		.replace(/https?:\/\/\S+/g, ' ');
	const words = prose.match(/[A-Za-z0-9]+(?:['’][A-Za-z0-9]+)*/g);
	return words?.length ?? 0;
}
