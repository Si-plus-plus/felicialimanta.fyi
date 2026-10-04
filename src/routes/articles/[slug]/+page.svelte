<script lang="ts">
	import type { PageData } from './$types';
	import { SITE_NAME } from '$lib/constants';
	import { markAsRead } from '$lib/readHistory';
	import { onMount } from 'svelte';

	let { data }: { data: PageData } = $props();

	onMount(() => {
		if (data.article && data.article.slug) {
			markAsRead(data.article.slug);
		}
	});
</script>

<svelte:head>
	<title>{data.article.title} — {SITE_NAME}</title>
	<meta name="description" content={data.article.description} />
</svelte:head>

<div class="fade-in">
	<!-- <a href="/" class="back-link">← Back to Articles</a> -->

	<article>
		<header class="article-header">
			<span class="article-date">{data.article.date}</span>
			<h1>{data.article.title}</h1>
			{#if data.article.description}
				<p class="article-description">{data.article.description}</p>
			{/if}
			{#if data.article.tags && data.article.tags.length > 0}
				<div class="article-tags">
					{#each data.article.tags as tag}
						<a href="/?tag={encodeURIComponent(tag)}" class="article-tag">#{tag}</a>
					{/each}
				</div>
			{/if}

			{#if (data.navigation?.previous?.length ?? 0) > 0 || (data.navigation?.next?.length ?? 0) > 0}
				<div class="series-top-nav">
					{#if data.navigation.previous.length > 0}
						<div class="series-nav-group previous-group">
							{#each data.navigation.previous as prev}
								<a href="/articles/{prev.slug}" class="series-nav-box prev-box">
									<span class="box-arrow" aria-hidden="true">←</span>
									<div class="box-content">
										<span class="box-label">Previous</span>
										<span class="box-title">{prev.title}</span>
									</div>
								</a>
							{/each}
						</div>
					{/if}

					{#if data.navigation.next.length > 0}
						<div class="series-nav-group next-group">
							{#each data.navigation.next as nextArt}
								<a href="/articles/{nextArt.slug}" class="series-nav-box next-box">
									<div class="box-content">
										<span class="box-label">Next</span>
										<span class="box-title">{nextArt.title}</span>
									</div>
									<span class="box-arrow" aria-hidden="true">→</span>
								</a>
							{/each}
						</div>
					{/if}
				</div>
			{/if}
		</header>

		<div class="article-content">
			{@html data.article.html}
		</div>

		{#if (data.navigation?.previous?.length ?? 0) > 0 || (data.navigation?.next?.length ?? 0) > 0}
			<nav class="series-bottom-nav" aria-label="Article series navigation">
				{#if data.navigation.previous.length > 0}
					<div class="series-nav-group previous-group">
						{#each data.navigation.previous as prev}
							<a href="/articles/{prev.slug}" class="series-nav-box prev-box">
								<span class="box-arrow" aria-hidden="true">←</span>
								<div class="box-content">
									<span class="box-label">Previous</span>
									<span class="box-title">{prev.title}</span>
								</div>
							</a>
						{/each}
					</div>
				{/if}

				{#if data.navigation.next.length > 0}
					<div class="series-nav-group next-group">
						{#each data.navigation.next as nextArt}
							<a href="/articles/{nextArt.slug}" class="series-nav-box next-box">
								<div class="box-content">
									<span class="box-label">Next</span>
									<span class="box-title">{nextArt.title}</span>
								</div>
								<span class="box-arrow" aria-hidden="true">→</span>
							</a>
						{/each}
					</div>
				{/if}
			</nav>
		{/if}
	</article>
</div>

<style>
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

	.article-description {
		font-size: 1.2rem;
		opacity: 0.7;
		margin: 16px 0 0 0;
		line-height: 1.5;
	}

	.article-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 24px;
	}

	.article-tag {
		font-size: 0.85rem;
		color: var(--accent);
		opacity: 0.8;
		text-decoration: none;
		transition: opacity var(--transition-speed) ease;
	}

	.article-tag:hover {
		opacity: 1;
		text-decoration: underline;
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

	.article-content :global(h3) {
		font-size: 1.2rem;
		font-weight: 500;
		margin-top: 40px;
		margin-bottom: 16px;
		letter-spacing: -0.015em;
		opacity: 0.9;
	}

	.article-content :global(h4) {
		font-size: 1rem;
		font-weight: 500;
		margin-top: 28px;
		margin-bottom: 12px;
		opacity: 0.85;
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


	.article-content :global(hr) {
		border: 0;
		border-top: 1px solid var(--lines);
		margin: 48px 0;
	}

	/* Series Navigation (Top & Bottom) */
	.series-top-nav {
		margin-top: 28px;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	/* Series Bottom Navigation */
	.series-bottom-nav {
		margin-top: 56px;
		padding-top: 32px;
		border-top: 1px solid var(--lines);
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.series-nav-group {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.series-nav-box {
		display: flex;
		align-items: center;
		padding: 16px 20px;
		background: transparent;
		border: 1px solid var(--lines) !important;
		border-radius: 8px;
		text-decoration: none;
		color: var(--text-primary) !important;
		gap: 16px;
		transition: all var(--transition-speed) ease;
	}

	.series-nav-box:hover {
		border-color: var(--accent) !important;
		background: color-mix(in srgb, var(--accent) 4%, transparent);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(79, 59, 120, 0.08);
	}

	:global([data-theme='dark']) .series-nav-box:hover {
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
	}

	.series-nav-box.next-box {
		justify-content: space-between;
		text-align: right;
	}

	.box-content {
		display: flex;
		flex-direction: column;
		gap: 4px;
		flex: 1;
		min-width: 0;
	}

	.box-label {
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--accent);
	}

	.box-title {
		font-size: 1rem;
		font-weight: 500;
		line-height: 1.45;
		color: var(--text-primary);
		word-break: break-word;
	}

	.box-arrow {
		font-size: 1.25rem;
		color: var(--accent);
		flex-shrink: 0;
		transition: transform var(--transition-speed) ease;
	}

	.prev-box:hover .box-arrow {
		transform: translateX(-4px);
	}

	.next-box:hover .box-arrow {
		transform: translateX(4px);
	}
</style>
