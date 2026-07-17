import { getArticles } from '$lib/server/parser';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = () => {
	const articles = getArticles();
	return {
		articles: articles.map((art) => ({
			slug: art.slug,
			date: art.date,
			title: art.title,
			description: art.description
		}))
	};
};
