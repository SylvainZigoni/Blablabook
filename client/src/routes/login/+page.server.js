// Import de fail pour le retourner en cas d'erreur via le try

import { fail } from "@sveltejs/kit";

export const actions = {
	// ajout des cookies dans login
	login: async ({ request, fetch, cookies }) => {
		const formData = await request.formData();
		const username = formData.get("username");
		const password = formData.get("password");

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_BASE_URL}/auth/login`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
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
					error: data.message || "Erreur lors de l'identififcation",
				});
			}

			cookies.set("token", data.token, {
				path: "/",
				httpOnly: true, // pour la sécurité
				sameSite: "lax", // pour la sécurité
				secure: true, // pour la sécurité
				maxAge: 60 * 60, // 60 secondes * 60 secondes
			});

			cookies.set("user_id", String(data.user.id), {
				path: "/",
				httpOnly: true,
				sameSite: "lax",
				secure: true,
				maxAge: 60 * 60,
			});

			cookies.set("user_name", String(data.user.username), {
				path: "/",
				httpOnly: true,
				sameSite: "lax",
				secure: true,
				maxAge: 60 * 60,
			});

			if (data.user.is_admin) {
				cookies.set("is_admin", String(data.user.is_admin), {
					path: "/",
					httpOnly: true,
					sameSite: "lax",
					secure: true,
					maxAge: 60 * 60,
				});
			}
			return {
				success: {
					username: data.user.username,
					token: data.token,
					id: data.user.id,
					admin: data.user.is_admin,
				},
			};
		} catch (error) {
			console.error("Erreur : ", error);
			return fail(500, { error: "Erreur serveur" });
		}
	},
};
