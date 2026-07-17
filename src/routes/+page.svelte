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

	let selectedTag = $derived($page.url.searchParams.get('tag') || 'All');
	let allTags = $derived(['All', ...new Set(data.articles.flatMap(a => a.tags || []))]);
	let filteredArticles = $derived(
		selectedTag === 'All' 
			? data.articles 
			: data.articles.filter(a => a.tags && a.tags.includes(selectedTag))
	);
</script>

<svelte:head>
	<title>{SITE_NAME} — Articles</title>
	<meta name="description" content={SITE_DESCRIPTION} />
</svelte:head>

<div class="fade-in">
	{#if data.articles.length === 0}
		<p class="empty-state">No articles published yet.</p>
	{:else}
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

		{#if filteredArticles.length === 0}
			<p class="empty-state">No articles found for #{selectedTag}.</p>
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

	.tag-filter {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 32px;
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
