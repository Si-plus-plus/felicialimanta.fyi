import { getArticleBySlug, getArticles, getArticleNavigation } from '$lib/server/parser';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, EntryGenerator } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const article = getArticleBySlug(params.slug);
	if (!article) {
		error(404, {
			message: 'Article not found'
		});
	}
	const navigation = getArticleNavigation(params.slug);
	return {
		article,
		navigation
	};
};

export const entries: EntryGenerator = () => {
	const articles = getArticles();
	return articles.map((art) => ({
		slug: art.slug
	}));
};
