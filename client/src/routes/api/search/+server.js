// Import de l'utilitaire json pour ne pas avoir a renvoyer une reponse http, mais seulement un objet
import { json } from "@sveltejs/kit";

export async function GET({ url }) {
	// On récupère les paramètres d'url
	const query = url.searchParams.get("q");
	const by = url.searchParams.get("by");

	console.log(query, by);
	// TODO : Mise en place du try catch

	// On réalise notre fetch
	// TODO : Ajouter le bearer + token avec la route définie coté back
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/books/random`
	);

	const data = await response.json();
	console.log(data);
	console.log(JSON.stringify(data));

	return json(data);
}
