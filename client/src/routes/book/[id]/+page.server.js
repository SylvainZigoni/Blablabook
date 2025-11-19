// Lorsque l'on arrive sur cette page on fait un fetch vers l'api pour récupérer les infos des livres et statut utilisateur.
// On aurait pu se permettre de garder les informations data.book du composant qui nous a amené ici, mais si on etait arrivé depuis la page d'accueil (ou le fetch ne renvoi pas les status utilisateur) alors les boutons de gestion de bibliotheque sur cette page n'auraient pas marchés

import { redirect } from "@sveltejs/kit";

export async function load({ params, fetch, parent }) {
	const { user_id, token } = await parent();

	if (!token) {
		throw redirect(302, "/");
	}

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
