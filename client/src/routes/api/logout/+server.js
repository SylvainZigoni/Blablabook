export async function POST({ cookies }) {
	cookies.delete("token", { path: "/" });
	cookies.delete("user_id", { path: "/" });
	cookies.delete("user_name", { path: "/" });

	return new Response(null, { status: 204 });
}
