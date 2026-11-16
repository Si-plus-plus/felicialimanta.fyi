import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	PUBLIC_GA_ID: {
		public: true,
		static: true,
		description: 'Google Analytics 4 Measurement ID',
		// optional, so local builds without analytics still work
		schema: (value) => value || undefined
	}
});
