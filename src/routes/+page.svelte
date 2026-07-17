<script lang="ts">
	import type { PageData } from './$types';
	import { clickBurst } from '$lib/clickBurst';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Felicia Limanta — Writings</title>
	<meta name="description" content="Personal thoughts, essays, and notes on software engineering and life." />
</svelte:head>

<main class="container fade-in">
	<header class="header border-b">
		<h1 class="logo"><a use:clickBurst href="/">felicialimanta.fyi</a></h1>
		<nav class="nav">
			<a use:clickBurst href="/" class="nav-link active">Writings</a>
		</nav>
	</header>

	<section class="intro">
		<p class="bio">
			Software engineer, designer, and writer. Sharing reflections on technology, design, and growth.
		</p>
	</section>

	<section class="articles-list">
		{#if data.articles.length === 0}
			<p class="empty-state">No articles published yet.</p>
		{:else}
			<ul class="list">
				{#each data.articles as article}
					<li class="item">
						<article class="article-preview">
							<span class="date">{article.date}</span>
							<h2 class="title">
								<a use:clickBurst href="/articles/{article.slug}">{article.title}</a>
							</h2>
							<p class="description">{article.description}</p>
						</article>
					</li>
				{/each}
			</ul>
		{/if}
	</section>
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

	.nav-link:hover, .nav-link.active {
		opacity: 1;
		color: var(--color-accent);
	}

	.intro {
		margin-bottom: 4rem;
	}

	.bio {
		font-size: 1.1rem;
		line-height: 1.6;
		color: var(--color-text);
		opacity: 0.8;
		max-width: 520px;
	}

	.articles-list {
		flex: 1;
	}

	.list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 3rem;
	}

	.item {
		padding: 0;
	}

	.article-preview {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.date {
		font-size: 0.8rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		opacity: 0.5;
	}

	.title {
		font-size: 1.5rem;
		font-weight: 500;
		margin: 0;
		line-height: 1.25;
	}

	.title a {
		text-decoration: none;
		color: var(--color-text);
		transition: color 0.2s ease;
	}

	.title a:hover {
		color: var(--color-accent);
	}

	.description {
		margin: 0.5rem 0 0 0;
		font-size: 1rem;
		line-height: 1.6;
		opacity: 0.7;
	}

	.empty-state {
		opacity: 0.5;
		font-style: italic;
	}
</style>
