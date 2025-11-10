<script>
    import { goto } from "$app/navigation";
    import BookShow from "./BookShow.svelte";

    export let userBooks = [];
    export let status;
    export let user_id;
    export let token;
    
    let message ="";

    // renvoie le statut du livre pour l’utilisateur, ou une chaîne vide si rien n’est défini.
    const getStatus = (book) => book.Users[0]?.Status?.status ?? "";
    
    // la liste des livres filtrés selon le statut actif (celui passé en prop status)
    $: filteredBooks = userBooks.filter(book => getStatus(book) === status);

    // Comptages par statut
    $: enCoursCount = userBooks.filter(b => getStatus(b) === "en cours").length;
    $: aLireCount   = userBooks.filter(b => getStatus(b) === "à lire").length;
    $: luCount      = userBooks.filter(b => getStatus(b) === "lu").length;

    // pour delete le livre via clique sur le bouton
    async function deleteBook (book_id) {
        const res = await fetch(`${import.meta.env.VITE_API_PUBLIC_URL}/books/${user_id}/${book_id}`,
        {
            method : 'DELETE',
            headers :{
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            } 
        });

        const result = await res.json();

        if(res.ok){
            userBooks = userBooks.filter(b => b.id !== book_id);

            // userBooks.some(b => getStatus(b) === status) → renvoie true si au moins un livre a encore ce statut.
            if (!userBooks.some(b => getStatus(b) === status)) {
                message = `Aucun livre dans ${status}`;
                 setTimeout(() => {
                 message = "";
                 goto(`/user/${user_id}/?status=en%20cours`);
                 }, 2000);
            } else {
                message = "Livre supprimé avec succès";
                setTimeout(() => {
                message = "";
                }, 2000);
            }
        }
    }

</script>

<div class="user_container">
    <div class="user_container_title">
        <h2 class="inscription-title">Ma Bibliothèque ({userBooks.length})</h2>
    </div>

    <ul class="status_filter">
        <!-- En svelte class:nomDeClasse={condition} -->
        <li><a href="?status=en%20cours" class:active={status === 'en cours'}>Lecture en cours ({enCoursCount})</a></li>
        <li><a href="?status=%C3%A0%20lire" class:active={status === 'à lire'}>Livres à lire ({aLireCount})</a></li>
        <li><a href="?status=lu" class:active={status === 'lu'}>Livres Lus ({luCount})</a></li>
    </ul>

    {#if message}
        <p class="confirmation-message"> {message}</p>
    {/if}
    <div class="books_container">   
        {#each filteredBooks as book }
            <BookShow {book} onDelete={deleteBook}/>
        {/each}
    </div>
</div>

<style>
    .user_container{
        width: 100%;
        max-width: 100%;
        overflow-x: hidden; /* Empêche le défilement horizontal */
        padding: 1rem;       
        margin: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .user_container_title{
        background-color:#354F52;
        padding: 1rem;
        width: 100%;
        border-radius: var(--border-radius);
    }
    /* pour ecrase le css global de app.css j'écrase le css global pour les h2 de la div class user_container_title*/
    :global(.user_container_title h2) {
        color: var(--color-text-secondary);
    }

    ul{
        display: flex;
        margin: 1rem;
    }

     li{
        margin-right: 2rem;
    }

    .active{
        text-decoration: underline;
        font-size: x-large;
    }

    .books_container{
        align-self: normal;
    }

    .status_filter{
        width: 100%;
        display: flex;
        justify-content: space-evenly;
        padding: 1rem;

    }

</style>