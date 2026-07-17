<script lang="ts">
	import type { PageData } from './$types';
	import { clickBurst } from '$lib/clickBurst';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Felicia Limanta — Writings</title>
	<meta name="description" content="Personal thoughts, essays, and notes on software engineering and life." />
</svelte:head>

<div class="fade-in">
	{#if data.articles.length === 0}
		<p class="empty-state">No articles published yet.</p>
	{:else}
		<ul class="article-list">
			{#each data.articles as article}
				<li class="article-item">
					<a use:clickBurst href="/articles/{article.slug}" class="article-link">
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
		transition: border-color var(--transition-speed) ease;
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
