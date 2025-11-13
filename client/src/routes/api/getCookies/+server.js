import { json } from "@sveltejs/kit";

export async function GET({ cookies }) {
	return json({
		user_id: cookies.get("user_id"),
		user_name: cookies.get("user_name"),
		token: cookies.get("token"),
		is_admin: cookies.get("is_admin"),
	});
}
