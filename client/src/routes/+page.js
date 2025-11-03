export async function load() {

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/books/random`);
    const books = await response.json();
    return { books };

}