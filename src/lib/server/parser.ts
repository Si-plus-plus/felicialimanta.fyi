import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

const ARTICLES_DIR = path.resolve('articles');

/**
 * Full parsed article model.
 */
export interface Article {
	directoryName: string;
	slug: string;
	date: string; // ISO format: YYYY-MM-DD
	title: string;
	description: string;
	html: string;
}

/**
 * Parsed article directory metadata.
 */
export interface ArticleInfo {
	directoryName: string;
	slug: string;
	date: string; // ISO format: YYYY-MM-DD
}

/**
 * Parses a directory name in YYYYMMDD_slug format.
 */
export function parseDirectoryName(dirName: string): { date: string; slug: string } | null {
	const match = dirName.match(/^(\d{4})(\d{2})(\d{2})_(.+)$/);
	if (!match) return null;
	const [_, year, month, day, slug] = match;
	return {
		date: `${year}-${month}-${day}`,
		slug
	};
}

/**
 * Returns a list of directory names inside the root articles/ directory.
 */
export function getArticleDirectories(): string[] {
	if (!fs.existsSync(ARTICLES_DIR)) {
		fs.mkdirSync(ARTICLES_DIR, { recursive: true });
	}
	return fs.readdirSync(ARTICLES_DIR).filter((file) => {
		const fullPath = path.join(ARTICLES_DIR, file);
		return fs.statSync(fullPath).isDirectory();
	});
}

/**
 * Reads all article directories and parses them into slugs and dates.
 */
export function getParsedDirectories(): ArticleInfo[] {
	const dirs = getArticleDirectories();
	const parsed: ArticleInfo[] = [];
	for (const dir of dirs) {
		const info = parseDirectoryName(dir);
		if (info) {
			parsed.push({
				directoryName: dir,
				slug: info.slug,
				date: info.date
			});
		}
	}
	return parsed;
}

/**
 * Reads and parses an article.md file inside the given article directory.
 */
export function parseArticleFile(dirName: string): Article {
	const info = parseDirectoryName(dirName);
	if (!info) {
		throw new Error(`Invalid article directory name format: "${dirName}". Expected YYYYMMDD_slug.`);
	}

	const filePath = path.join(ARTICLES_DIR, dirName, 'article.md');
	if (!fs.existsSync(filePath)) {
		throw new Error(`Missing article.md in directory: "${dirName}".`);
	}

	// Auto-copy assets (images, etc) to the public static directory
	const srcDir = path.join(ARTICLES_DIR, dirName);
	const destDir = path.resolve('static', 'articles', info.slug);
	if (!fs.existsSync(destDir)) {
		fs.mkdirSync(destDir, { recursive: true });
	}
	const files = fs.readdirSync(srcDir);
	for (const file of files) {
		if (file !== 'article.md') {
			const srcFile = path.join(srcDir, file);
			const destFile = path.join(destDir, file);
			if (fs.statSync(srcFile).isFile()) {
				fs.copyFileSync(srcFile, destFile);
			}
		}
	}

	const content = fs.readFileSync(filePath, 'utf-8');

	// Parse frontmatter block delimited by ---
	const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
	if (!match) {
		throw new Error(`Invalid frontmatter format in: "${dirName}/article.md". Expected leading and trailing "---" blocks.`);
	}

	const [_, yamlStr, markdownBody] = match;

	const titleMatch = yamlStr.match(/^title:\s*"([^"]+)"/m) || yamlStr.match(/^title:\s*'([^']+)'/m) || yamlStr.match(/^title:\s*([^\r\n]+)/m);
	const descMatch = yamlStr.match(/^description:\s*"([^"]+)"/m) || yamlStr.match(/^description:\s*'([^']+)'/m) || yamlStr.match(/^description:\s*([^\r\n]+)/m);

	const title = titleMatch ? titleMatch[1].trim() : '';
	const description = descMatch ? descMatch[1].trim() : '';

	if (!title) {
		throw new Error(`Missing "title" in frontmatter of: "${dirName}/article.md".`);
	}
	if (!description) {
		throw new Error(`Missing "description" in frontmatter of: "${dirName}/article.md".`);
	}

	// Render Markdown to HTML
	let html = marked.parse(markdownBody) as string;

	// Fix relative image paths and wrap all images in figures with captions
	html = html.replace(
		/<img\s+([^>]*?)src=["']([^"']+)["']([^>]*?)>/gi,
		(match, beforeSrc, src, afterSrc) => {
			// Rewrite relative image paths
			let finalSrc = src;
			if (!src.startsWith('http') && !src.startsWith('/')) {
				finalSrc = `/articles/${info.slug}/${src}`;
			}
			
			// Extract alt text for caption
			const altMatch = match.match(/alt=["']([^"']*)["']/i);
			const altText = altMatch && altMatch[1] ? altMatch[1] : '';
			
			return `<figure class="article-image">
				<img ${beforeSrc}src="${finalSrc}"${afterSrc}>
				${altText ? `<figcaption>${altText}</figcaption>` : ''}
			</figure>`;
		}
	);

	return {
		directoryName: dirName,
		slug: info.slug,
		date: info.date,
		title,
		description,
		html
	};
}

/**
 * Validates all articles under the articles/ directory.
 * Throws an error if there are duplicates, invalid formats, or missing files.
 * Returns the list of parsed articles.
 */
export function validateArticles(): Article[] {
	const dirs = getArticleDirectories();
	const articles: Article[] = [];
	const slugsMap = new Map<string, string>(); // slug -> directoryName
	const titlesMap = new Map<string, string>(); // title (lowercase) -> directoryName

	for (const dir of dirs) {
		let article: Article;
		try {
			article = parseArticleFile(dir);
		} catch (err: any) {
			throw new Error(`[Article Validation Error] In directory "${dir}": ${err.message}`);
		}

		// Check for duplicate slugs
		if (slugsMap.has(article.slug)) {
			const conflictingDir = slugsMap.get(article.slug)!;
			throw new Error(
				`[Article Validation Error] Duplicate slug "${article.slug}" detected.\n` +
				`Conflicting directories:\n` +
				`- articles/${conflictingDir}\n` +
				`- articles/${dir}`
			);
		}
		slugsMap.set(article.slug, dir);

		// Check for duplicate titles
		const lowerTitle = article.title.toLowerCase();
		if (titlesMap.has(lowerTitle)) {
			const conflictingDir = titlesMap.get(lowerTitle)!;
			throw new Error(
				`[Article Validation Error] Duplicate title "${article.title}" detected.\n` +
				`Conflicting directories:\n` +
				`- articles/${conflictingDir}\n` +
				`- articles/${dir}`
			);
		}
		titlesMap.set(lowerTitle, dir);

		articles.push(article);
	}

	return articles;
}

/**
 * Gets all validated articles, sorted by date in descending order.
 */
export function getArticles(): Article[] {
	const articles = validateArticles();
	return articles.sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Gets a single validated article by its URL slug.
 * Returns undefined if no matching article is found.
 */
export function getArticleBySlug(slug: string): Article | undefined {
	const articles = validateArticles();
	return articles.find((article) => article.slug === slug);
}





