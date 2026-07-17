<script lang="ts">
	import type { PageData } from './$types';
	import { clickBurst } from '$lib/clickBurst';
	import { onMount } from 'svelte';

	let { data }: { data: PageData } = $props();

	onMount(() => {
		// Bind click burst directly to all links within the rendered markdown body
		const links = document.querySelectorAll('.prose a');
		links.forEach((link) => {
			clickBurst(link as HTMLElement);
		});
	});
</script>

<svelte:head>
	<title>{data.article.title} — Felicia Limanta</title>
	<meta name="description" content={data.article.description} />
</svelte:head>

<main class="container fade-in">
	<header class="header border-b">
		<h1 class="logo"><a use:clickBurst href="/">felicialimanta.fyi</a></h1>
		<nav class="nav">
			<a use:clickBurst href="/" class="nav-link">Writings</a>
		</nav>
	</header>

	<article class="article-detail">
		<header class="article-header">
			<span class="date">{data.article.date}</span>
			<h1 class="title">{data.article.title}</h1>
			<p class="description">{data.article.description}</p>
		</header>
		<div class="prose">
			{@html data.article.html}
		</div>
	</article>
</main>

<style>
	.container {
		max-width: 680px;
		margin: 0 auto;
		padding: 2rem 1.5rem;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding-bottom: 1.5rem;
		margin-bottom: 3rem;
	}

	.logo {
		font-size: 1.25rem;
		font-weight: 500;
		margin: 0;
	}

	.logo a {
		text-decoration: none;
		color: var(--color-text);
	}

	.nav {
		display: flex;
		gap: 1.5rem;
	}

	.nav-link {
		font-size: 0.9rem;
		text-decoration: none;
		color: var(--color-text);
		opacity: 0.6;
		transition: opacity 0.2s ease, color 0.2s ease;
	}

	.nav-link:hover {
		opacity: 1;
		color: var(--color-accent);
	}

	.article-detail {
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
	}

	.article-header {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		border-bottom: 1px solid var(--color-border);
		padding-bottom: 2rem;
	}

	.date {
		font-size: 0.8rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		opacity: 0.5;
	}

	.title {
		font-size: 2.25rem;
		font-weight: 500;
		line-height: 1.2;
		margin: 0;
		color: var(--color-text);
	}

	.description {
		font-size: 1.15rem;
		line-height: 1.6;
		margin: 0.25rem 0 0 0;
		opacity: 0.7;
	}

	/* Prose/Markdown body styling */
	.prose {
		font-size: 1rem;
		line-height: 1.7;
		color: var(--color-text);
	}

	.prose :global(p) {
		margin: 0 0 1.5rem 0;
		opacity: 0.9;
	}

	.prose :global(h2) {
		font-size: 1.5rem;
		font-weight: 500;
		margin: 2.5rem 0 1rem 0;
		color: var(--color-text);
	}

	.prose :global(h3) {
		font-size: 1.25rem;
		font-weight: 500;
		margin: 2rem 0 1rem 0;
		color: var(--color-text);
	}

	.prose :global(ul), .prose :global(ol) {
		margin: 0 0 1.5rem 0;
		padding-left: 1.5rem;
		opacity: 0.9;
	}

	.prose :global(li) {
		margin-bottom: 0.5rem;
	}

	.prose :global(a) {
		color: var(--color-accent);
		text-decoration: underline;
		text-underline-offset: 3px;
		transition: opacity 0.2s ease;
	}

	.prose :global(a:hover) {
		opacity: 0.8;
	}

	.prose :global(blockquote) {
		margin: 2rem 0;
		padding: 0.5rem 0 0.5rem 1.25rem;
		border-left: 3px solid var(--color-accent);
		font-style: italic;
		opacity: 0.8;
	}

	.prose :global(pre) {
		background-color: var(--color-border);
		padding: 1rem;
		border-radius: 4px;
		overflow-x: auto;
		margin: 1.5rem 0;
	}

	.prose :global(code) {
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
		font-size: 0.9em;
		background-color: var(--color-border);
		padding: 0.2rem 0.4rem;
		border-radius: 4px;
	}

	.prose :global(pre code) {
		background-color: transparent;
		padding: 0;
		border-radius: 0;
		font-size: 0.85em;
	}
</style>
