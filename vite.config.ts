import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { validateArticles } from './src/lib/server/parser';

export default defineConfig({
	plugins: [
		{
			name: 'validate-articles',
			buildStart() {
				validateArticles();
			}
		},
		sveltekit()
	]
});

