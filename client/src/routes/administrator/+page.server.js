import { redirect } from "@sveltejs/kit";

export async function load({ parent }) {
	const { is_admin, token } = await parent();

	if (!token) {
		throw redirect(302, "/");
	}

	if (!is_admin && is_admin != true && is_admin !== "true")
		throw redirect(302, "/");
}
