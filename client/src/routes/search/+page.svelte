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
            // Attention, notre tableau books est dans data, il faut alors faire le map sur data.books et non books.
            // Etant donné les conditions actuelles pour afficher les bouton dans BookShow, on fait un spread de l'objet en forcant le book.userStatus à '' pour pas rentrer en conflit avec les autres conditions
            data.books = books.map(book => book.id === book_id ? { ...book, userStatus:'', Users: [{ Status: { status: "à lire" } }]} : book);
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

            // Comme pour la fonction addBook, on vient fait une copie de notre objet book apres avoir réalisé un map.
            // Dans la copie de book, on ajoute userStatus à "absent" et on force book.Users.Status.status à "" pour gérer les conflits de if de bookShow
            data.books = books.map(book => book.id === book_id
                ? {
                    ...book,
                    userStatus: 'absent',
                    Users: Array.isArray(book.Users)
                        ? book.Users.map(u => ({ 
                            ...u, 
                            Status: { ...(u.Status || {}), status: "" } 
                          }))
                        : book.Users
                }
                : book
            );
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
                <BookShow {book} onAdd={addBook} onDelete={deleteBook} user_id={user_id} token={token} />
            {/each}

    {/if}
</section>