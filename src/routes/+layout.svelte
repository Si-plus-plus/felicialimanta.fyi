<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { triggerClickBurst } from '$lib/clickBurst';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { SITE_NAME, SITE_BIO, SITE_FOOTER } from '$lib/constants';
	import type { LayoutData } from './$types';
	import { goto } from '$app/navigation';

	let { data, children } = $props<{ data: LayoutData; children: any }>();

	let theme = $state('light');
	let fontSize = $state(16);

	function goToRandomArticle(e: MouseEvent) {
		e.preventDefault();
		if (data.articles && data.articles.length > 0) {
			const randomIndex = Math.floor(Math.random() * data.articles.length);
			goto(`/articles/${data.articles[randomIndex].slug}`);
		}
	}

	onMount(() => {
		// Global click listener for the burst effect
		const handleGlobalClick = (e: MouseEvent) => triggerClickBurst(e.clientX, e.clientY);
		document.addEventListener('click', handleGlobalClick);

		// Read persisted settings on mount
		const storedTheme = document.documentElement.getAttribute('data-theme');
		if (storedTheme) {
			theme = storedTheme;
		} else {
			// Fallback to media query preference detection
			theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		}

		const storedSize = localStorage.getItem('font-size');
		if (storedSize) {
			fontSize = parseInt(storedSize, 10);
		}

		return () => {
			document.removeEventListener('click', handleGlobalClick);
		};
	});

	// Synchronize font size base property on mount as well to ensure correctness
	$effect(() => {
		document.documentElement.style.setProperty('--font-size-base', `${fontSize}px`);
	});

	function toggleTheme() {
		theme = theme === 'light' ? 'dark' : 'light';
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
	}

	function increaseFontSize() {
		if (fontSize < 24) {
			fontSize += 2;
			localStorage.setItem('font-size', fontSize.toString());
		}
	}

	function decreaseFontSize() {
		if (fontSize > 12) {
			fontSize -= 2;
			localStorage.setItem('font-size', fontSize.toString());
		}
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="container">
	{#if $page.url.pathname === '/'}
		<header class="site-header home-header">
			<h1 class="site-title"><a href="/">{SITE_NAME}</a></h1>
			<p class="site-bio">{SITE_BIO}</p>
			<nav class="site-nav">
				<a href="/" onclick={goToRandomArticle}>Random Article</a>
			</nav>
		</header>
	{:else}
		<header class="site-header inner-header">
			<h1 class="site-title"><a href="/">{SITE_NAME}</a></h1>
			<nav class="site-nav">
				<a href="/">Home</a>
				<a href="/" onclick={goToRandomArticle}>Random Article</a>
			</nav>
		</header>
	{/if}

	<main>
		{@render children()}
	</main>

	<footer>
		{SITE_FOOTER}
	</footer>
</div>

<div class="control-panel">
	<button onclick={decreaseFontSize} class="control-btn" title="Decrease Font Size" aria-label="Decrease Font Size">A-</button>
	<button onclick={increaseFontSize} class="control-btn" title="Increase Font Size" aria-label="Increase Font Size">A+</button>
	<div class="control-divider"></div>
	<button onclick={toggleTheme} class="control-btn" title="Toggle Light/Dark Theme" aria-label="Toggle Theme">
		{#if theme === 'light'}
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
		{:else}
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
		{/if}
	</button>
</div>
