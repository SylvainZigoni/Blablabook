<script>
    import BookShow from "./BookShow.svelte";
    export let books=[]; 

</script>

<div class="user_container">
    <h2 class="inscription-title">Ma Bibliothèque</h2>
    <ul class="status_filter">
        <li><a href=""></a> Lecture en cours (xxx)</li>
        <li><a href=""></a> Livres à lire (xxx)</li>
        <li><a href=""></a> Livres Lus (xxx)</li>
    </ul>
    <div class="books_container">
        {#each books as book }
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
</style>