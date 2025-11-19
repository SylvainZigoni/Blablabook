// Import de l'utilitaire json pour ne pas avoir a renvoyer une reponse http, mais seulement un objet
// La fonction search etant liée au header et non a une page, elle a été déclarée ici pour etre partagée entre les pages.
// Elle est appellé via un 1er fetch du front (qui arrive ici) et un nouveau fetch est effectué ici vers l'api

import { json } from "@sveltejs/kit";

export async function GET({ url, fetch, cookies }) {
	// On récupère les paramètres d'url
	const q = url.searchParams.get("q");
	const by = url.searchParams.get("by");
	const user_id = cookies.get("user_id");
	const token = cookies.get("token");

	if (!token) {
		return json({ results: [], error: "Utilisateur non Authorisé" });
	}

	try {
		const params = new URLSearchParams({ q, by });

		// On réalise notre fetch
		const response = await fetch(
			`${import.meta.env.VITE_API_BASE_URL}/books/${by}/${q}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		const data = await response.json();

		return json(data, { status: response.status });
	} catch (error) {
		console.error("Erreur lors de la connexion fetch avec backend", error);
		return json(
			{ error: "Erreur lors de la connexion fetch avec backend" },
			{ status: 500 }
		);
	}
}
