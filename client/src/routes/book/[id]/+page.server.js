import { redirect } from "@sveltejs/kit";

export async function load({ params, fetch, parent }) {
	const { user_id, token } = await parent();

	if (!token) {
		throw redirect(302, "/");
	}

	console.log("token avant fetch", token);
	console.log(
		"Route de fetch",
		`${import.meta.env.VITE_API_BASE_URL}/books/${params.id}/${user_id}`
	);

	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/books/${params.id}/${user_id}`,
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
