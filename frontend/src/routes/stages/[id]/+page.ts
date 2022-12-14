import { browser } from '$app/environment';
import token from '$lib/stores/token';
import { fetch } from '$lib/util/fetch';
import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch: f, parent }) => {
	// wait for +layout.ts to finish getting the access token
	if (!browser) return;
	await parent();

	const id = params.id;
	const res = await fetch(
		`/api/stages/${id}`,
		{ headers: { Authorization: 'Bearer ' + get(token) } },
		f
	);
	const data = await res.json();
	if (!res.ok) {
		throw error(res.status, data.message);
	} else {
		return { stage: data.stage };
	}
};
