<script lang="ts">
	import type { PageData } from './$types';
	import { SITE_NAME, SITE_DESCRIPTION } from '#lib/constants.ts';
	import { getReadArticles } from '#lib/readHistory.ts';
	import { READING_LENGTH_TAGS } from '#lib/readingLength.ts';
	import { browser } from '$app/env';
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	let { data }: { data: PageData } = $props();

	let readSlugs = $state<string[]>([]);
	onMount(() => {
		readSlugs = getReadArticles();
	});

	let selectedTags = $derived(browser ? page.url.searchParams.getAll('tag').filter(Boolean) : []);
	let selectedLength = $derived(browser ? (page.url.searchParams.get('length') || 'All') : 'All');
	let searchQuery = $state('');
	let allTags = $derived(
		[...new Set(data.articles.flatMap((a) => a.tags || []))].sort((a, b) =>
			a.toLowerCase().localeCompare(b.toLowerCase())
		)
	);
	let filtersApplied = $derived(selectedTags.length > 0 || selectedLength !== 'All');
	let articlesForTags = $derived(
		selectedTags.length === 0
			? data.articles
			: data.articles.filter((article) => article.tags?.some((tag) => selectedTags.includes(tag)))
	);
	let availableLengths = $derived(new Set(articlesForTags.map((article) => article.readingLength)));
	let articlesForLength = $derived(
		selectedLength === 'All'
			? data.articles
			: data.articles.filter((article) => article.readingLength === selectedLength)
	);
	let availableTags = $derived(new Set(articlesForLength.flatMap((article) => article.tags || [])));
	let filteredArticles = $derived(
		data.articles.filter(a => {
			const tagMatch = selectedTags.length === 0 || (a.tags && selectedTags.some((tag) => a.tags.includes(tag)));
			const lengthMatch = selectedLength === 'All' || a.readingLength === selectedLength;
			const query = searchQuery.trim().toLowerCase();
			const queryMatch = !query || 
				[a.title, a.description, a.date, a.searchText]
					.filter(Boolean)
					.some(text => text!.toLowerCase().includes(query));
			return tagMatch && lengthMatch && queryMatch;
		})
	);

	function listHref(tags: string[], length: string): string {
		const params = new URLSearchParams();
		for (const tag of tags) params.append('tag', tag);
		if (length !== 'All') params.set('length', length);
		const query = params.toString();
		return query ? `/?${query}` : '/';
	}

	function toggleTag(tag: string): string {
		const next = selectedTags.includes(tag)
			? selectedTags.filter((selected) => selected !== tag)
			: [...selectedTags, tag];
		return listHref(next, selectedLength);
	}

	function toggleLength(length: string): string {
		return listHref(selectedTags, selectedLength === length ? 'All' : length);
	}

	function getUnavailableLengthTooltip(length: string): string {
		if (selectedTags.length === 1) {
			return `No ${length} reads in #${selectedTags[0]}`;
		}
		if (selectedTags.length > 1) {
			return `No ${length} reads for selected tags`;
		}
		return `No ${length} reads available`;
	}

	function getUnavailableTagTooltip(tag: string): string {
		if (selectedLength !== 'All') {
			return `No ${selectedLength} reads in #${tag}`;
		}
		return `No articles in #${tag}`;
	}

	function escapeRegExp(str: string): string {
		return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	function getSegments(text: string, query: string): { text: string; isMatch: boolean }[] {
		const trimmed = query.trim();
		if (!trimmed || !text) return [{ text, isMatch: false }];
		const regex = new RegExp(`(${escapeRegExp(trimmed)})`, 'gi');
		const parts = text.split(regex);
		return parts.map(part => ({
			text: part,
			isMatch: part.toLowerCase() === trimmed.toLowerCase()
		}));
	}

	function getContentSnippet(text: string | undefined, query: string): string | null {
		const trimmed = query.trim();
		if (!trimmed || !text) return null;
		const index = text.toLowerCase().indexOf(trimmed.toLowerCase());
		if (index === -1) return null;

		const start = Math.max(0, index - 50);
		const end = Math.min(text.length, index + trimmed.length + 110);
		let snippet = text.slice(start, end);
		if (start > 0) snippet = '...' + snippet;
		if (end < text.length) snippet = snippet + '...';
		return snippet;
	}

	function getMatchingSnippet(article: PageData['articles'][number], query: string): string | null {
		const trimmed = query.trim().toLowerCase();
		if (!trimmed) return null;

		if (article.description && article.description.toLowerCase().includes(trimmed)) {
			return getContentSnippet(article.description, query);
		}

		if (article.searchText && article.searchText.toLowerCase().includes(trimmed)) {
			return getContentSnippet(article.searchText, query);
		}

		return null;
	}
</script>

<svelte:head>
	<title>{SITE_NAME} — Articles</title>
	<meta name="description" content={SITE_DESCRIPTION} />
</svelte:head>

<div class="fade-in">
	{#if data.articles.length === 0}
		<p class="empty-state">No articles published yet.</p>
	{:else}
		<div class="controls-container">
			<div class="controls-top">
				<div class="search-container">
					<svg
						class="search-icon"
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<circle cx="11" cy="11" r="8" />
						<path d="m21 21-4.3-4.3" />
					</svg>
					<input
						type="search"
						bind:value={searchQuery}
						placeholder="Search articles..."
						class="search-input"
					/>
					{#if searchQuery}
						<button
							type="button"
							class="clear-btn"
							aria-label="Clear search"
							onclick={() => (searchQuery = '')}
						>
							&times;
						</button>
					{/if}
				</div>
				<div class="length-control" role="group" aria-label="Article length">
					{#each READING_LENGTH_TAGS as length, i}
						{#if i > 0}
							<div class="length-divider" aria-hidden="true"></div>
						{/if}
						{@const lengthUnavailable = selectedLength !== length && !availableLengths.has(length)}
						{#if lengthUnavailable}
							{@const lengthTooltip = getUnavailableLengthTooltip(length)}
							<span
								class="length-btn unavailable"
								aria-disabled="true"
								aria-label="{length} ({lengthTooltip})"
								data-tooltip={lengthTooltip}
							>
								{length}
							</span>
						{:else}
							<a
								href={toggleLength(length)}
								class="length-btn"
								class:active={selectedLength === length}
							>
								{length}
							</a>
						{/if}
					{/each}
				</div>
			</div>
			<div class="tag-filter" aria-label="Filter by topic">
				{#each allTags as tag}
					{@const tagUnavailable = !selectedTags.includes(tag) && !availableTags.has(tag)}
					{#if tagUnavailable}
						{@const tagTooltip = getUnavailableTagTooltip(tag)}
						<span
							class="tag-button unavailable"
							aria-disabled="true"
							aria-label="#{tag} ({tagTooltip})"
							data-tooltip={tagTooltip}
						>
							#{tag}
						</span>
					{:else}
						<a
							href={toggleTag(tag)}
							class="tag-button"
							class:active={selectedTags.includes(tag)}
						>
							#{tag}
						</a>
					{/if}
				{/each}
				{#if filtersApplied}
					<a href="/" class="reset-btn">Reset</a>
				{/if}
			</div>
		</div>

		{#if filteredArticles.length === 0}
			{@const filters = [
				selectedTags.length ? selectedTags.map((tag) => `#${tag}`).join(' ') : '',
				selectedLength !== 'All' ? selectedLength : '',
				searchQuery ? `"${searchQuery}"` : ''
			].filter(Boolean)}
			<p class="empty-state">No articles found{filters.length ? ` for ${filters.join(', ')}` : ''}</p>
		{:else}
			<ul class="article-list">
				{#each filteredArticles as article}
					{@const snippet = searchQuery.trim() ? getMatchingSnippet(article, searchQuery) : null}
					{@const snippetCoversDescription = !!(
						snippet &&
						searchQuery.trim() &&
						article.description.toLowerCase().includes(searchQuery.trim().toLowerCase())
					)}
					{@const showDescription = !!(article.description && !snippetCoversDescription)}
					{@const hasTags = !!(article.tags && article.tags.length > 0)}
					<li class="article-item" class:read={readSlugs.includes(article.slug)} class:pinned={article.pinned}>
						<a href="/articles/{article.slug}" class="article-link">
							{#if article.pinned}
								<span class="pinned-badge">
									<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
										<path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
									</svg>
									Pinned
								</span>
							{/if}
							<span class="article-date">{article.date}</span>
							<h2 class="article-title">
								{#each getSegments(article.title, searchQuery) as segment}
									{#if segment.isMatch}
										<mark class="highlight">{segment.text}</mark>
									{:else}
										{segment.text}
									{/if}
								{/each}
							</h2>
							{#if snippet}
								<p class="article-snippet">
									{#each getSegments(snippet, searchQuery) as segment}
										{#if segment.isMatch}
											<mark class="highlight">{segment.text}</mark>
										{:else}
											{segment.text}
										{/if}
									{/each}
								</p>
							{/if}
							<div class="article-footer" class:has-description={showDescription}>
								{#if showDescription}
									<div class="article-description">
										<p>{article.description}</p>
									</div>
								{/if}
								<div class="article-tags">
									{#if hasTags}
										{#each article.tags as tag}
											<span class="article-tag">#{tag}</span>
										{/each}
										<span class="tags-separator" aria-hidden="true">·</span>
									{/if}
									<span class="reading-length">{article.readingMinutes} min read</span>
								</div>
							</div>
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	{/if}
</div>

<style>
	.article-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.article-item {
		border-bottom: 1px solid var(--lines);
		transition: border-color var(--transition-speed) ease, opacity var(--transition-speed) ease;
	}

	.article-item.read {
		opacity: 0.5;
	}

	.article-item.read:hover {
		opacity: 1;
	}

	.article-item:last-child {
		border-bottom: none;
	}

	.pinned-badge {
		position: absolute;
		top: 32px;
		right: 0;
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 2px 8px;
		border-radius: 99px;
		font-size: 0.58rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--accent);
		background: color-mix(in srgb, var(--accent) 10%, transparent);
		line-height: 1;
		pointer-events: none;
		opacity: 0.85;
	}

	.pinned-badge svg {
		flex-shrink: 0;
		width: 8px;
		height: 8px;
		opacity: 0.8;
	}

	.article-item.pinned .article-link {
		padding-right: 4.25rem;
	}

	.article-link {
		position: relative;
		display: block;
		padding: 32px 0;
		text-decoration: none;
		color: var(--text-primary);
		transition: transform var(--transition-speed) cubic-bezier(0.4, 0, 0.2, 1);
	}

	.article-date {
		display: block;
		font-size: 0.85rem;
		opacity: 0.5;
		margin-bottom: 8px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.article-title {
		font-size: 1.35rem;
		font-weight: 400;
		margin: 0;
		transition: color var(--transition-speed) ease;
		letter-spacing: -0.01em;
	}

	mark.highlight {
		background-color: rgba(79, 59, 120, 0.15);
		color: var(--accent);
		border-radius: 2px;
		padding: 0 2px;
	}

	:root[data-theme='dark'] mark.highlight {
		background-color: rgba(165, 146, 214, 0.25);
		color: var(--accent);
	}

	.article-snippet {
		font-size: 0.9rem;
		opacity: 0.75;
		margin: 8px 0 0 0;
		line-height: 1.5;
	}

	.article-footer {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-top: 8px;
		min-width: 0;
	}

	.article-description p {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.5;
		opacity: 0.7;
	}

	@media (hover: hover) {
		.article-link {
			padding: 32px 0 18px;
		}

		.article-footer {
			display: grid;
			align-items: start;
			gap: 0;
			margin-top: 12px;
			min-height: calc(2 * 0.95rem * 1.5);
		}

		.article-footer > * {
			grid-area: 1 / 1;
			min-width: 0;
		}

		.article-description {
			opacity: 0;
			pointer-events: none;
			transition: opacity var(--transition-speed) ease;
		}

		.article-link:hover .article-description,
		.article-link:focus-visible .article-description {
			opacity: 1;
		}

		.article-link:hover .article-footer.has-description .article-tags,
		.article-link:focus-visible .article-footer.has-description .article-tags {
			opacity: 0;
		}

		.article-link:hover {
			transform: translateX(12px);
		}

		.article-link:hover .article-title {
			color: var(--accent);
		}
	}

	.empty-state {
		opacity: 0.5;
		font-style: italic;
	}

	.controls-container {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-bottom: 32px;
	}

	.controls-top {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	@media (min-width: 560px) {
		.controls-top {
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			gap: 12px;
		}
	}

	.search-container {
		position: relative;
		width: 100%;
		flex: 1;
		min-width: 0;
	}

	.search-icon {
		position: absolute;
		left: 13px;
		top: 50%;
		transform: translateY(-50%);
		color: var(--text-primary);
		opacity: 0.4;
		pointer-events: none;
		transition: color var(--transition-speed) ease, opacity var(--transition-speed) ease;
	}

	.search-container:focus-within .search-icon {
		color: var(--accent);
		opacity: 0.85;
	}

	.search-input {
		width: 100%;
		padding: 6px 30px 6px 34px;
		font-family: inherit;
		font-size: 0.85rem;
		line-height: 1.5;
		border: 1px solid var(--lines);
		border-radius: 99px;
		background: transparent;
		color: var(--text-primary);
		opacity: 0.65;
		transition: all var(--transition-speed) ease;
	}

	.search-input::-webkit-search-cancel-button,
	.search-input::-webkit-search-decoration {
		-webkit-appearance: none;
		appearance: none;
	}

	.search-input:hover,
	.search-input:focus {
		outline: none;
		border-color: var(--accent);
		opacity: 1;
	}

	.clear-btn {
		position: absolute;
		right: 10px;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		color: var(--text-primary);
		opacity: 0.5;
		cursor: pointer;
		font-family: inherit;
		font-size: 1.1rem;
		line-height: 1;
		padding: 0 4px;
		transition: opacity var(--transition-speed) ease, color var(--transition-speed) ease;
	}

	.clear-btn:hover {
		opacity: 1;
		color: var(--accent);
	}

	.search-input::placeholder {
		color: var(--text-primary);
		opacity: 0.5;
	}

	.length-control {
		display: inline-flex;
		align-items: center;
		align-self: flex-start;
		border: 1px solid var(--lines);
		border-radius: 99px;
		padding: 3px;
		background: transparent;
		flex-shrink: 0;
		transition: border-color var(--transition-speed) ease;
	}

	@media (min-width: 560px) {
		.length-control {
			align-self: center;
		}
	}

	.length-btn {
		padding: 4px 12px;
		border-radius: 99px;
		font-size: 0.78rem;
		font-weight: 500;
		line-height: 1.4;
		color: var(--text-primary);
		opacity: 0.55;
		text-decoration: none;
		white-space: nowrap;
		transition: all var(--transition-speed) ease;
	}

	.length-btn:not(.unavailable):hover {
		color: var(--accent);
		opacity: 1;
	}

	.length-btn.active {
		background: var(--text-primary);
		color: var(--bg-primary);
		opacity: 1;
	}

	.length-btn.unavailable {
		position: relative;
		opacity: 1;
		color: color-mix(in srgb, var(--text-primary) 25%, transparent);
		cursor: not-allowed;
		user-select: none;
	}

	.length-divider {
		width: 1px;
		height: 12px;
		background-color: var(--lines);
		flex-shrink: 0;
		transition: opacity var(--transition-speed) ease;
	}

	.length-btn.active + .length-divider,
	.length-divider:has(+ .length-btn.active) {
		opacity: 0;
	}

	.tag-filter {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
		min-width: 0;
	}

	.tag-button {
		background: transparent;
		border: 1px solid var(--lines);
		color: var(--text-primary);
		opacity: 0.6;
		padding: 5px 13px;
		border-radius: 99px;
		font-size: 0.82rem;
		line-height: 1.4;
		white-space: nowrap;
		text-decoration: none;
		display: inline-block;
		cursor: pointer;
		transition: all var(--transition-speed) ease;
	}

	.tag-button:not(.unavailable):hover {
		border-color: var(--accent);
		color: var(--accent);
		opacity: 1;
	}

	.tag-button.active {
		background: var(--text-primary);
		color: var(--bg-primary);
		border-color: var(--text-primary);
		opacity: 1;
	}

	.tag-button.unavailable {
		position: relative;
		opacity: 1;
		color: color-mix(in srgb, var(--text-primary) 28%, transparent);
		border-color: color-mix(in srgb, var(--lines) 55%, transparent);
		cursor: not-allowed;
		user-select: none;
	}

	.length-btn.unavailable::after,
	.tag-button.unavailable::after {
		content: attr(data-tooltip);
		position: absolute;
		bottom: calc(100% + 8px);
		left: 50%;
		transform: translateX(-50%) translateY(4px);
		background-color: var(--text-primary);
		color: var(--bg-primary);
		padding: 5px 10px;
		border-radius: 6px;
		font-size: 0.72rem;
		font-weight: 400;
		line-height: 1.3;
		white-space: nowrap;
		pointer-events: none;
		opacity: 0;
		visibility: hidden;
		transition: opacity 0.18s ease, transform 0.18s ease, visibility 0.18s ease;
		border: 1px solid var(--lines);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
		z-index: 40;
	}

	.length-btn.unavailable:hover::after,
	.tag-button.unavailable:hover::after {
		opacity: 1;
		visibility: visible;
		transform: translateX(-50%) translateY(0);
	}

	.length-control .length-btn.unavailable:first-child::after,
	.tag-filter .tag-button.unavailable:first-child::after {
		left: 0;
		transform: translateY(4px);
	}

	.length-control .length-btn.unavailable:first-child:hover::after,
	.tag-filter .tag-button.unavailable:first-child:hover::after {
		transform: translateY(0);
	}

	@media (min-width: 560px) {
		.length-control .length-btn.unavailable:first-child::after {
			left: 50%;
			transform: translateX(-50%) translateY(4px);
		}

		.length-control .length-btn.unavailable:first-child:hover::after {
			transform: translateX(-50%) translateY(0);
		}

		.length-control .length-btn.unavailable:last-child::after {
			left: auto;
			right: 0;
			transform: translateY(4px);
		}

		.length-control .length-btn.unavailable:last-child:hover::after {
			transform: translateY(0);
		}
	}

	.reset-btn {
		margin-left: auto;
		font-size: 0.78rem;
		font-weight: 500;
		color: var(--accent);
		opacity: 0.75;
		text-decoration: none;
		padding: 4px 6px;
		transition: opacity var(--transition-speed) ease;
	}

	.reset-btn:hover {
		opacity: 1;
		text-decoration: underline;
	}

	.article-tags {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
		transition: opacity var(--transition-speed) ease;
	}

	.article-tag {
		font-size: 0.85rem;
		color: var(--accent);
		opacity: 0.8;
	}

	.tags-separator,
	.reading-length {
		font-size: 0.85rem;
		opacity: 0.45;
	}
</style>
