export async function GET({ url }) {
	const query = url.searchParams.get("q");
	const by = url.searchParams.get("by");

	console.log(query, by);

	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/books/random`
	);

	const data = await response.json();
	console.log(data);
	console.log(JSON.stringify(data));

	return new Response(JSON.stringify(data), {
		headers: { "Content-Type": "application/json" },
	});
}
