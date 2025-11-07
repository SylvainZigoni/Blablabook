// Import de l'utilitaire json pour ne pas avoir a renvoyer une reponse http, mais seulement un objet
import { json } from "@sveltejs/kit";

export async function GET({ url, fetch, cookies }) {
	// On récupère les paramètres d'url
	const q = url.searchParams.get("q");
	const by = url.searchParams.get("by");

	console.log(q, by);

	// TODO : Récupérer les cookies pour envoyer le token
	console.log(cookies.get("user_name"));

	// TODO : Mise en place du try catch

	try {
		const params = new URLSearchParams({ q, by });
		console.log(params);

		// On réalise notre fetch
		// TODO : Ajouter le bearer + token avec la route définie coté back
		const response = await fetch(
			`${import.meta.env.VITE_API_BASE_URL}/books/random`
		);

		const data = await response.json();
		console.log(data);
		console.log(JSON.stringify(data));

		return json(data, { status: response.status });
	} catch (error) {
		console.error("Erreur lors de la connexion fetch avec backend", error);
		return json(
			{ error: "Erreur lors de la connexion fetch avec backend" },
			{ status: 500 }
		);
	}
}
