<script>
	import BookShow from '$lib/components/ui/BookShow.svelte';
    export let data;
    // On met '$' pour rendre l'ensemble des variables destructurées dynamiques
    $: ({ books = [], query = "", by = "title", error } = data);
</script>

<section>
    <h2>Resultats de la recherche "{query}" par {by}</h2>

    {#if error}
        <p class="error"> Erreur : {error}</p>
    {:else if books.length === 0}
        <p>Aucun résultat</p>
    {:else}

            {#each books as book}
                <BookShow {book} />
            {/each}

    {/if}
</section>