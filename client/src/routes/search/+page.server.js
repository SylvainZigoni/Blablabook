export async function load({ url, fetch, cookies }) {
	const q = url.searchParams.get("q");
	const by = url.searchParams.get("by");

	console.log("Console.log fichier +page.server", q, by);

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
	const user_id = cookies.get("user_id");
	const token = cookies.get("token");

	return { books, query: q, by: by, user_id, token };
}
