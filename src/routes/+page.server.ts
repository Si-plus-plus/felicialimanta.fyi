import { getArticles } from '$lib/server/parser';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
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
