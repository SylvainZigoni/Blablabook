import { fail, redirect } from "@sveltejs/kit";

export const actions = {
	login: async ({ request, fetch }) => {
		const formData = await request.formData();
		const username = formData.get("username");
		const password = formData.get("password");

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_BASE_URL}/auth/login`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application.json",
					},
					body: JSON.stringify({
						username,
						password,
					}),
				}
			);

			const data = await response.json();

			if (!response.ok) {
				return fail(response.status, {
					error: data.error || "Erreur lors de l'identififcation",
				});
			}

			return { success: { username: data.username } };
		} catch (error) {
			console.error("Erreur : ", error);
			return fail(500, { error: "Erreur serveur" });
		}
	},
};
