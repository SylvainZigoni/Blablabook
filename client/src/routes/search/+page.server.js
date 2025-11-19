import { redirect } from "@sveltejs/kit";

// Plus besoin de load cookies car ces derniers sont récupérés par parent
export async function load({ url, fetch, parent }) {
	const q = url.searchParams.get("q");
	const by = url.searchParams.get("by");
	let byFrench = "";

	const { user_id, token } = await parent();

	if (!token) {
		throw redirect(302, "/");
	}

	if (!q) {
		return { results: [], query: q, by };
	}

	const params = new URLSearchParams({ q, by });
	const response = await fetch(`/api/search?${params.toString()}`);

	if (!response.ok) {
		const error = await response.text().catch(() => response.statusText);
		return { results: [], error: error, query: q, by: by };
	}

	const books = await response.json();

	if (by === "author") {
		byFrench = "Auteur";
	}

	if (by === "title") {
		byFrench = "Titre";
	}

	return { books, query: q, by: byFrench, user_id, token };
}
