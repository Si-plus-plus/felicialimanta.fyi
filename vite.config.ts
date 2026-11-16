import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-static';
import { defineConfig } from 'vite';
import { validateArticles } from './src/lib/server/parser.ts';

export default defineConfig({
	plugins: [
		{
			name: 'validate-articles',
			buildStart() {
				validateArticles();
			}
		},
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: true
			},
			adapter: adapter(),
			prerender: {
				handleHttpError: 'warn'
			}
		})
	]
});
