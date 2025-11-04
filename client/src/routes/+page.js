export async function load( { fetch }) {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}books/random`);

        if (!response.ok) {
            console.error(`Erreur API: ${response.status} ${response.statusText}`);
            return { books: [], error: `Impossible de charger les livres (${response.status})` };
        }

        const books = await response.json();
        return { books };
    
}