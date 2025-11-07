<script>
    import BookShow from "./BookShow.svelte";
    export let userBooks = [];
    export let status;

    // plus besoin de tester plusieurs cas
    // grâce à la normalisation côté API, c’est simple :
    const getStatus = (book) => book.Users[0]?.Status?.status ?? "";

    $: filteredBooks = userBooks.filter(book => getStatus(book) === status);

    //$: console.log("statut", statut);
</script>

<div class="user_container">
    <div class="user_container_title">
        <h2 class="inscription-title">Ma Bibliothèque</h2>
    </div>

    <ul class="status_filter">
        <li><a href="?status=en%20cours">Lecture en cours (xxx)</a></li>
        <li><a href="?status=%C3%A0%20lire">Livres à lire (xxx)</a></li>
        <li><a href="?status=lu">Livres Lus (xxx)</a></li>
    </ul>

    <div class="books_container">   
        {#each filteredBooks as book }
            <BookShow {book}/>
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