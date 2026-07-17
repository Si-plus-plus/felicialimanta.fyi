<script lang="ts">
	import { page } from '$app/stores';
	import { SITE_NAME } from '$lib/constants';
</script>

<svelte:head>
	<title>Page Not Found — {SITE_NAME}</title>
</svelte:head>

<div class="fade-in">
	<section class="error-section">
		<span class="status">404</span>
		<h2 class="message">Page not found</h2>
		<p class="description">
			{$page.error?.message || "The page you are looking for doesn't exist or has been moved."}
		</p>
		<a href="/" class="back-link">Go back home</a>
	</section>
</div>

<style>
	.error-section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		gap: 1rem;
		padding: 80px 0;
	}

	.status {
		font-size: 5rem;
		font-weight: 500;
		color: var(--accent);
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
		color: var(--bg-primary);
		background-color: var(--text-primary);
		padding: 0.75rem 1.5rem;
		border-radius: 4px;
		transition: background-color var(--transition-speed) ease, transform 0.1s ease;
	}

	.back-link:hover {
		background-color: var(--accent);
	}
</style>
