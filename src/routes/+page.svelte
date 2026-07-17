<script lang="ts">
	import type { PageData } from './$types';
	import { SITE_NAME, SITE_DESCRIPTION } from '$lib/constants';
	import { getReadArticles } from '$lib/readHistory';
	import { onMount } from 'svelte';

	let { data }: { data: PageData } = $props();

	let readSlugs = $state<string[]>([]);
	onMount(() => {
		readSlugs = getReadArticles();
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
		<ul class="article-list">
			{#each data.articles as article}
				<li class="article-item" class:read={readSlugs.includes(article.slug)}>
					<a href="/articles/{article.slug}" class="article-link">
						<span class="article-date">{article.date}</span>
						<h2 class="article-title">{article.title}</h2>
					</a>
				</li>
			{/each}
		</ul>
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
</style>
