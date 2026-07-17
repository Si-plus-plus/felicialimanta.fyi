<script lang="ts">
	import { page } from '$app/stores';
	import { clickBurst } from '$lib/clickBurst';
</script>

<svelte:head>
	<title>Page Not Found — Felicia Limanta</title>
</svelte:head>

<main class="container fade-in">
	<header class="header border-b">
		<h1 class="logo"><a use:clickBurst href="/">felicialimanta.fyi</a></h1>
		<nav class="nav">
			<a use:clickBurst href="/" class="nav-link">Writings</a>
		</nav>
	</header>

	<section class="error-section">
		<span class="status">404</span>
		<h2 class="message">Page not found</h2>
		<p class="description">
			{$page.error?.message || "The page you are looking for doesn't exist or has been moved."}
		</p>
		<a use:clickBurst href="/" class="back-link">Go back home</a>
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

	.nav-link:hover {
		opacity: 1;
		color: var(--color-accent);
	}

	.error-section {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		gap: 1rem;
		padding-bottom: 5rem;
	}

	.status {
		font-size: 5rem;
		font-weight: 500;
		color: var(--color-accent);
		line-height: 1;
	}

	.message {
		font-size: 1.75rem;
		font-weight: 500;
		margin: 0;
	}

	.description {
		font-size: 1rem;
		opacity: 0.6;
		max-width: 320px;
		margin: 0 0 1.5rem 0;
		line-height: 1.5;
	}

	.back-link {
		display: inline-block;
		text-decoration: none;
		font-size: 0.95rem;
		font-weight: 500;
		color: var(--color-bg);
		background-color: var(--color-text);
		padding: 0.75rem 1.5rem;
		border-radius: 4px;
		transition: background-color 0.2s ease, transform 0.1s ease;
	}

	.back-link:hover {
		background-color: var(--color-accent);
	}
</style>
