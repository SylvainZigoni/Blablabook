export async function getAllUsers(token) {
    const response = await fetch(`${import.meta.env.VITE_API_PUBLIC_URL}/admin/users`,
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
			error: `Impossible de charger les livres (${response.status})`,
		};
	}
	const data = await response.json();
    // console.log('return du fetch',data.users);
	return data.users;
}

export async function DeleteUser(user_id, token) {
    const response = await fetch(`${import.meta.env.VITE_API_PUBLIC_URL}/admin/users/${user_id}`,
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

export async function UserUpdate(user_id, payload, token) {
    const response = await fetch(`${import.meta.env.VITE_API_PUBLIC_URL}/admin/users/${user_id}`,
        {
            method :"PATCH",
            headers :{
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });
    if(!response.ok){
        throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
    }
    return await response.json();
}

export async function UserCreate(payload, token) {
    const response = await fetch(`${import.meta.env.VITE_API_PUBLIC_URL}/admin/users`,
        {
            method : "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });
    if(!response.ok){
        throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
    }
    return await response.json();
}