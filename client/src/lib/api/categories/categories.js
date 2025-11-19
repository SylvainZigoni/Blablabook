export async function getAllCategories(token) {
	const response = await fetch(
		`${import.meta.env.VITE_API_PUBLIC_URL}/admin/categories`,
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		}
	);
	if (!response.ok) {
		console.error(`Erreur API: ${response.status} ${response.statusText}`);
		return {
			categories: [],
			error: `Impossible de charger les livres (${response.status})`,
		};
	}
	const data = await response.json();

	return data.categories;
}

export async function DeleteCategory(category_id, token) {
	const response = await fetch(
		`${
			import.meta.env.VITE_API_PUBLIC_URL
		}/admin/categories/${category_id}`,
		{
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		}
	);

	if (!response.ok) {
		throw new Error(
			`Erreur API: ${response.status} ${response.statusText}`
		);
	}
	return await response.json();
}

export async function CategoryUpdate(category_id, payload, token) {
	const response = await fetch(
		`${
			import.meta.env.VITE_API_PUBLIC_URL
		}/admin/categories/${category_id}`,
		{
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(payload),
		}
	);
	if (!response.ok) {
		throw new Error(
			`Erreur API: ${response.status} ${response.statusText}`
		);
	}
	return await response.json();
}

export async function CategoryCreate(payload, token) {
	const response = await fetch(
		`${import.meta.env.VITE_API_PUBLIC_URL}/admin/categories`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(payload),
		}
	);
	if (!response.ok) {
		throw new Error(
			`Erreur API: ${response.status} ${response.statusText}`
		);
	}

	return await response.json();
}
