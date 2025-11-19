// Ici on est dans le back de Sveltekit. On défini ici la fonction pour récupérer les cookies car seulement réalisable en back et n'est pas liée à une page mais à un composant
// Ce fonctionnement est le début de nos expérimentations avec les cookies. Par la suite nous avons décidé de les transmettre entre composant en utilisant +layout.server.js et {parent} pour les récuperer dans le load

// Comme on est sur une requete type http (GET, POST, PATCH, ...) la réponse de base attendue n'est pas un json classique mais une "Response" avec un code http. On importe donc la methode json pour pouvoir faire un return plus classique d'objet.
import { json } from "@sveltejs/kit";

export async function GET({ cookies }) {
	return json({
		user_id: cookies.get("user_id"),
		user_name: cookies.get("user_name"),
		token: cookies.get("token"),
		is_admin: cookies.get("is_admin"),
	});
}
