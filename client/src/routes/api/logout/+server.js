// Fonction pour supprimer les cookies. A faire coté back car cookies inacessibles en front.
export async function POST({ cookies }) {
	cookies.delete("token", { path: "/" });
	cookies.delete("user_id", { path: "/" });
	cookies.delete("user_name", { path: "/" });
	cookies.delete("is_admin", { path: "/" });

	return new Response(null, { status: 204 });
}
