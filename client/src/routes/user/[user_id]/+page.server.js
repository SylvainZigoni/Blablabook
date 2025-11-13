export async function load( { fetch, parent, url}) {
    // const user_id = cookies.get('user_id');
    // const token = cookies.get('token');
    const {user_id, token} = await parent();
    
    if(!token){
        return { userBooks : [], error: "Utilisateur non Authentifié"}
    }

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/books/${user_id}`, {
        headers : {
            // Authorization: `Bearer ${cookies.get("token")}`,
            Authorization: `Bearer ${token}`,
        }
    });

    const userBooks = await response.json();

    // lire le paramètre "statut" dans l'URL, sinon par défaut "en cours"
    const status = url.searchParams.get("status") || "en cours";
    
    // return { userBooks, status, user_id, token };
    return { userBooks, status};
}
