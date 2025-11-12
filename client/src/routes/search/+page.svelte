<script>
	import AddBookButton from '$lib/components/ui/AddBookButton.svelte';
	import BookShow from '$lib/components/ui/BookShow.svelte';
    export let data;

   
    // On met '$' pour rendre l'ensemble des variables destructurées dynamiques
    $: ({ books = [], query = "", by = "title", error, user_id, token } = data);

   let message = ""

    async function addBook (book_id) {

        const response = await fetch (`${import.meta.env.VITE_API_PUBLIC_URL}/books/${user_id}/${book_id}`,
            {
                method : 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    Authorization : `Bearer ${token}` 
                }
            }
        );

        const result = await response.json();
        if (response.ok) {
            // Attention, notre tableau books est dans data, il faut alors faire le map sur data.books et non books
            data.books = books.map(book => book.id === book_id ? { ...book, userStatus: 'en-cours'} : book);
        }
    }


    async function deleteBook (book_id) {

        const response = await fetch (`${import.meta.env.VITE_API_PUBLIC_URL}/books/${user_id}/${book_id}`,
            {
                method : 'DELETE',
                headers: {
                    'Content-Type' : 'application/json',
                    Authorization : `Bearer ${token}`
                }
            }
        );

        const result = await response.json();
        if (response.ok) {
            data.books = books.map(book => book.id === book_id ? { ...book, userStatus: 'absent'} : book);
        }
    }



</script>

<section>
    <h2>Resultats de la recherche "{query}" par {by}</h2>

    {#if error}
        <p class="error"> Erreur : {error}</p>
    {:else if books.length === 0}
        <p>Aucun résultat</p>
    {:else}

            {#each books as book}
                <BookShow {book} onAdd={addBook} onDelete={deleteBook} />
            {/each}

    {/if}
</section>