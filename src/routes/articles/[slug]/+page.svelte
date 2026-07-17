<script lang="ts">
	import type { PageData } from './$types';
	import { clickBurst } from '$lib/clickBurst';
	import { onMount } from 'svelte';

	let { data }: { data: PageData } = $props();

	onMount(() => {
		// Bind click burst directly to all links within the rendered markdown body
		const links = document.querySelectorAll('.article-content a');
		links.forEach((link) => {
			clickBurst(link as HTMLElement);
		});
	});
</script>

<svelte:head>
	<title>{data.article.title} — Felicia Limanta</title>
	<meta name="description" content={data.article.description} />
</svelte:head>

<div class="fade-in">
	<a use:clickBurst href="/" class="back-link">← Back to Articles</a>

	<article>
		<header class="article-header">
			<span class="article-date">{data.article.date}</span>
			<h1>{data.article.title}</h1>
		</header>

		<div class="article-content">
			{@html data.article.html}
		</div>
	</article>
</div>

<style>
	.back-link {
		display: inline-flex;
		align-items: center;
		margin-bottom: 32px;
		font-size: 0.9rem;
		color: var(--text-primary);
		text-decoration: none;
		opacity: 0.6;
		transition: all var(--transition-speed) ease;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.back-link:hover {
		opacity: 1;
		color: var(--accent);
		transform: translateX(-4px);
	}

	.article-header {
		margin-bottom: 48px;
	}

	.article-date {
		display: block;
		font-size: 0.9rem;
		opacity: 0.5;
		margin-bottom: 12px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.article-header h1 {
		font-size: 2.25rem;
		font-weight: 500;
		margin: 0;
		letter-spacing: -0.03em;
		line-height: 1.2;
	}

	.article-content :global(p) {
		margin-bottom: 24px;
		font-size: 1rem;
		line-height: 1.8;
		opacity: 0.85;
	}

	.article-content :global(h2) {
		font-size: 1.5rem;
		font-weight: 500;
		margin-top: 56px;
		margin-bottom: 24px;
		letter-spacing: -0.02em;
	}

	.article-content :global(blockquote) {
		border-left: 3px solid var(--lines);
		margin: 40px 0;
		padding-left: 24px;
		font-style: italic;
		opacity: 0.7;
		transition: border-color var(--transition-speed) ease;
	}

	.article-content :global(blockquote:hover) {
		border-color: var(--accent);
	}

	.article-content :global(a) {
		color: var(--accent);
		text-decoration: none;
		border-bottom: 1px solid transparent;
		transition: border-color var(--transition-speed) ease;
	}

	.article-content :global(a:hover) {
		border-bottom-color: var(--accent);
	}

	.article-content :global(ul),
	.article-content :global(ol) {
		margin-bottom: 24px;
		padding-left: 24px;
		opacity: 0.85;
		line-height: 1.8;
	}

	.article-content :global(li) {
		margin-bottom: 8px;
	}

	.article-content :global(code) {
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
		background-color: var(--lines);
		padding: 4px 6px;
		border-radius: 4px;
		font-size: 0.85em;
	}

	.article-content :global(pre) {
		background-color: var(--lines);
		padding: 24px;
		border-radius: 8px;
		overflow-x: auto;
		margin: 32px 0;
		line-height: 1.6;
	}

	.article-content :global(pre code) {
		background-color: transparent;
		padding: 0;
		border-radius: 0;
		font-size: 0.9em;
	}

	.article-content :global(img) {
		max-width: 100%;
		height: auto;
		border-radius: 8px;
		margin: 40px 0;
		display: block;
	}

	.article-content :global(hr) {
		border: 0;
		border-top: 1px solid var(--lines);
		margin: 48px 0;
	}
</style>
