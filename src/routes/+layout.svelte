<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { clickBurst } from '$lib/clickBurst';
	import { onMount } from 'svelte';

	let { children } = $props();

	let theme = $state('light');
	let fontSize = $state(16);

	onMount(() => {
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
	});

	function toggleTheme() {
		theme = theme === 'light' ? 'dark' : 'light';
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
	}

	function increaseFontSize() {
		if (fontSize < 24) {
			fontSize += 1;
			document.documentElement.style.setProperty('--font-size-base', `${fontSize}px`);
			localStorage.setItem('font-size', fontSize.toString());
		}
	}

	function decreaseFontSize() {
		if (fontSize > 12) {
			fontSize -= 1;
			document.documentElement.style.setProperty('--font-size-base', `${fontSize}px`);
			localStorage.setItem('font-size', fontSize.toString());
		}
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<div class="control-panel">
	<button use:clickBurst onclick={toggleTheme} class="control-btn" title="Toggle Light/Dark Theme" aria-label="Toggle Theme">
		{#if theme === 'light'}
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
		{:else}
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
		{/if}
	</button>
	<div class="divider"></div>
	<button use:clickBurst onclick={decreaseFontSize} class="control-btn" title="Decrease Font Size" aria-label="Decrease Font Size">A-</button>
	<span class="font-indicator">{fontSize}px</span>
	<button use:clickBurst onclick={increaseFontSize} class="control-btn" title="Increase Font Size" aria-label="Increase Font Size">A+</button>
</div>

<style>
	.control-panel {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background-color: var(--color-bg-panel);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid var(--color-border);
		padding: 0.5rem 0.75rem;
		border-radius: 9999px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		z-index: 1000;
		transition: opacity 0.2s ease, transform 0.2s ease;
	}

	:root[data-theme='dark'] .control-panel {
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
	}

	.control-btn {
		background: none;
		border: none;
		color: var(--color-text);
		cursor: pointer;
		padding: 0.25rem 0.5rem;
		border-radius: 9999px;
		font-family: inherit;
		font-size: 0.85rem;
		font-weight: 500;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0.6;
		transition: opacity 0.2s ease, background-color 0.2s ease, color 0.2s ease;
	}

	.control-btn:hover {
		opacity: 1;
		background-color: var(--color-border);
		color: var(--color-accent);
	}

	.divider {
		width: 1px;
		height: 1rem;
		background-color: var(--color-border);
	}

	.font-indicator {
		font-size: 0.75rem;
		font-weight: 500;
		opacity: 0.5;
		min-width: 2.25rem;
		text-align: center;
		user-select: none;
	}
</style>
