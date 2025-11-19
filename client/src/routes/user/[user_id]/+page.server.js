import { redirect } from "@sveltejs/kit";

export async function load({ fetch, parent, url }) {
	const { user_id, token } = await parent();

	// Si le token n'existe pas ou a expiré on retourne l'utilisateur vers la page d'accueil
	if (!token) {
		throw redirect(302, "/");
	}

	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/books/${user_id}`,
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);

	const userBooks = await response.json();

	// lire le paramètre "statut" dans l'URL, sinon par défaut "en cours"
	const status = url.searchParams.get("status") || "en cours";

	return { userBooks, status };
}
