<script lang="ts">
	import type { PageData } from './$types';
	import { SITE_NAME, SITE_DESCRIPTION } from '$lib/constants';
	import { getReadArticles } from '$lib/readHistory';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let { data }: { data: PageData } = $props();

	let readSlugs = $state<string[]>([]);
	onMount(() => {
		readSlugs = getReadArticles();
	});

	let selectedTag = $state('All');
	let searchQuery = $state('');
	let allTags = $derived(['All', ...new Set(data.articles.flatMap(a => a.tags || []))]);
	let filteredArticles = $derived(
		data.articles.filter(a => {
			const tagMatch = selectedTag === 'All' || (a.tags && a.tags.includes(selectedTag));
			const query = searchQuery.trim().toLowerCase();
			const queryMatch = !query || 
				[a.title, a.description, a.date, a.searchText]
					.filter(Boolean)
					.some(text => text!.toLowerCase().includes(query));
			return tagMatch && queryMatch;
		})
	);

	$effect(() => {
		const tag = $page.url.searchParams.get('tag');
		selectedTag = tag || 'All';
	});
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
			<div class="tag-filter">
				{#each allTags as tag}
					<a 
						href={tag === 'All' ? '/' : `/?tag=${encodeURIComponent(tag)}`}
						class="tag-button" 
						class:active={selectedTag === tag}
					>
						{tag === 'All' ? 'All' : `#${tag}`}
					</a>
				{/each}
			</div>

			<div class="search-container">
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
						onclick={() => searchQuery = ''}
					>
						&times;
					</button>
				{/if}
			</div>
		</div>

		{#if filteredArticles.length === 0}
			<p class="empty-state">No articles found{selectedTag !== 'All' ? ` for #${selectedTag}` : ''}{searchQuery ? ` matching "${searchQuery}"` : ''}.</p>
		{:else}
			<ul class="article-list">
				{#each filteredArticles as article}
					<li class="article-item" class:read={readSlugs.includes(article.slug)}>
						<a href="/articles/{article.slug}" class="article-link">
							<span class="article-date">{article.date}</span>
							<h2 class="article-title">{article.title}</h2>
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

	.article-link {
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
		flex-direction: column-reverse;
		gap: 16px;
		margin-bottom: 32px;
	}

	@media (min-width: 640px) {
		.controls-container {
			flex-direction: row;
			justify-content: space-between;
			align-items: flex-start;
		}
	}

	.search-container {
		position: relative;
		width: 100%;
	}

	@media (min-width: 640px) {
		.search-container {
			width: 240px;
			flex-shrink: 0;
		}
	}

	.search-input {
		width: 100%;
		padding: 6px 30px 6px 14px;
		font-family: inherit;
		font-size: 0.85rem;
		border: 1px solid var(--lines);
		border-radius: 99px;
		background: transparent;
		color: var(--text-primary);
		transition: border-color var(--transition-speed) ease;
	}

	.search-input::-webkit-search-cancel-button,
	.search-input::-webkit-search-decoration {
		-webkit-appearance: none;
		appearance: none;
	}

	.search-input:focus {
		outline: none;
		border-color: var(--accent);
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

	.tag-filter {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		flex: 1;
	}

	.tag-button {
		background: transparent;
		border: 1px solid var(--lines);
		color: var(--text-primary);
		opacity: 0.6;
		padding: 6px 14px;
		border-radius: 99px;
		font-size: 0.85rem;
		text-decoration: none;
		display: inline-block;
		cursor: pointer;
		transition: all var(--transition-speed) ease;
	}

	.tag-button:hover {
		border-color: var(--accent);
		opacity: 1;
	}

	.tag-button.active {
		background: var(--text-primary);
		color: var(--bg-primary);
		border-color: var(--text-primary);
		opacity: 1;
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
