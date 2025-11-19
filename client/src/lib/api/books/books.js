export async function getAllBooks(token) {
	const response = await fetch(
		`${import.meta.env.VITE_API_PUBLIC_URL}/admin/books`,
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
			books: [],
			error: `Impossible de charger les livres (${response.status})`,
		};
	}
	const data = await response.json();

	return data.books;
}

export async function DeleteBook(book_id, token) {
	const response = await fetch(
		`${import.meta.env.VITE_API_PUBLIC_URL}/admin/books/${book_id}`,
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

export async function BookCreate(payload, token) {
	const response = await fetch(
		`${import.meta.env.VITE_API_PUBLIC_URL}/admin/books`,
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
