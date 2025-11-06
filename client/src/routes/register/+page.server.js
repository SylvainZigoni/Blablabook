import { fail, redirect } from "@sveltejs/kit";

export const actions = {
	// register appelé dans le action du formulaire
	register: async ({ request, fetch }) => {
		const formData = await request.formData();
		const username = formData.get("username");
		const email = formData.get("email");
		const password = formData.get("password");
		const confirm = formData.get("confirm");

		// Validation simple
		if (password !== confirm) {
			return fail(400, {
				error: "Les mots de passe ne correspondent pas",
			});
		}

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_BASE_URL}/auth/add`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						username,
						email,
						password,
						confirm,
					}),
				}
			);

			const data = await response.json();

        if (!response.ok) {
                return fail(response.status, { error: data.message || 'Erreur de création du compte' });
            }

			// En cas de succès
			return { success: { username: data.username, email: data.email } };
		} catch (error) {
			console.error("Erreur serveur:", error);
			return fail(500, { error: "Erreur de connexion au serveur" });
		}
	},
};
