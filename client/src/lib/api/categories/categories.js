export async function getAllCategories() {
    const response = await fetch(`${import.meta.env.VITE_API_PUBLIC_URL}/admin/categories`);
    if (!response.ok) {
		console.error(`Erreur API: ${response.status} ${response.statusText}`);
		return {
			categories: [],
			error: `Impossible de charger les livres (${response.status})`,
		};
	}
	const data = await response.json();
    // console.log('return du fetch',data.categories);

	return data.categories;
}

export async function DeleteCategory(category_id, token) {
    const response = await fetch(`${import.meta.env.VITE_API_PUBLIC_URL}/admin/categories/${category_id}`,
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

export async function CategoryUpdate(category_id, payload, token) {
    const response = await fetch(`${import.meta.env.VITE_API_PUBLIC_URL}/admin/categories/${category_id}`,
        {
            method :"PATCH",
            headers :{
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });
    if(!response){
        throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
    }
    return await response.json();
}