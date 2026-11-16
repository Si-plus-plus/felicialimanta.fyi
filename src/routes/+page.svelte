<script lang="ts">
	import type { PageData } from './$types';
	import { SITE_NAME, SITE_DESCRIPTION } from '$lib/constants';
	import { getReadArticles } from '$lib/readHistory';
	import { READING_LENGTH_TAGS } from '$lib/readingLength';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let { data }: { data: PageData } = $props();

	let readSlugs = $state<string[]>([]);
	onMount(() => {
		readSlugs = getReadArticles();
	});

	let selectedTags = $derived($page.url.searchParams.getAll('tag').filter(Boolean));
	let selectedLength = $derived($page.url.searchParams.get('length') || 'All');
	let searchQuery = $state('');
	let allTags = $derived([...new Set(data.articles.flatMap((a) => a.tags || []))]);
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
							<span class="length-btn unavailable" aria-disabled="true">{length}</span>
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
						<span class="tag-button unavailable" aria-disabled="true">#{tag}</span>
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
							<div class="article-meta">
								<span class="article-date">{article.date}</span>
								<span class="reading-length">{article.readingLength}</span>
							</div>
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
							{#if article.description && !snippetCoversDescription}
								<div class="article-description">
									<p>{article.description}</p>
								</div>
							{/if}
							{#if article.tags && article.tags.length > 0}
								<div class="article-tags">
									{#each article.tags as tag}
										<span class="article-tag">#{tag}</span>
									{/each}
								</div>
							{/if}
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

	.article-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 10px;
		margin-bottom: 8px;
	}

	.article-date {
		display: block;
		font-size: 0.85rem;
		opacity: 0.5;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.reading-length {
		font-size: 0.72rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		opacity: 0.45;
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

	.article-description {
		display: grid;
		grid-template-rows: 0fr;
		margin-top: 0;
		opacity: 0;
		transition:
			grid-template-rows var(--transition-speed) cubic-bezier(0.4, 0, 0.2, 1),
			margin-top var(--transition-speed) cubic-bezier(0.4, 0, 0.2, 1),
			opacity var(--transition-speed) ease;
	}

	.article-description p {
		overflow: hidden;
		min-height: 0;
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.5;
		opacity: 0.7;
	}

	.article-link:focus-visible .article-description {
		grid-template-rows: 1fr;
		margin-top: 8px;
		opacity: 1;
	}

	@media (hover: hover) {
		.article-link:hover .article-description {
			grid-template-rows: 1fr;
			margin-top: 8px;
			opacity: 1;
		}
	}

	.article-link:hover {
		transform: translateX(12px);
	}

	.article-link:hover .article-title {
		color: var(--accent);
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

	.length-btn:hover {
		color: var(--accent);
		opacity: 1;
	}

	.length-btn.active {
		background: var(--text-primary);
		color: var(--bg-primary);
		opacity: 1;
	}

	.length-btn.unavailable {
		opacity: 0.25;
		cursor: default;
		pointer-events: none;
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

	.tag-button:hover {
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
		opacity: 0.28;
		cursor: default;
		pointer-events: none;
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
		gap: 8px;
		margin-top: 12px;
	}

	.article-tag {
		font-size: 0.85rem;
		color: var(--accent);
		opacity: 0.8;
	}
</style>
