export async function load({ params, fetch, parent }) {
	const { user_id, token } = await parent();

	const response = await fetch(
		`${import.meta.env.VITE_API_PUBLIC_URL}/books/${params.id}/${user_id}`,
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);

	if (!response.ok) {
		throw new Error("Livre absent");
	}

	const book = await response.json();
	return { book };
}
