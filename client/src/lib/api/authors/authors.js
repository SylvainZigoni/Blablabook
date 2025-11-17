export async function getAllAuthors(token) {
    const response = await fetch(`${import.meta.env.VITE_API_PUBLIC_URL}/admin/authors`,
        {
            headers : {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }
    );
    if (!response.ok) {
		console.error(`Erreur API: ${response.status} ${response.statusText}`);
		return {
			users: [],
			error: `Impossible de charger les auteurs (${response.status})`,
		};
	}
	const data = await response.json();
    console.log('return du fetch',data.authors);
	return data.authors;
}

export async function DeleteAuthor(authorId, token) {
    const response = await fetch(`${import.meta.env.VITE_API_PUBLIC_URL}/admin/authors/${authorId}`,
        {
            method : 'DELETE',
            headers :{
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            } 
        });
    if (!response.ok) {
        throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
    }
    return await response.json();
}