export async function load( { fetch, params, cookies}) {
    const user_id = params.user_id;
    const token = cookies.get('token');

    if(!token){
        return { userBooks : [], error: "Utilisateur non Authentifié"}
    }

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/books/${user_id}`, {
        headers : {
            Authorization: `Bearer ${cookies.get("token")}`,
        }
    });

    const userBooks = await response.json();
    console.log(userBooks);
    return { userBooks };
}