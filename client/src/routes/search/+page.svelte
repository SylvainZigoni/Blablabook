<script>
    export let data;
    let { results = [], query = "", by = "title", error } = data;
</script>

<section>
    <h2>Resultats de la recherche "{query}" par {by}</h2>

    {#if error}
        <p class="error"> Erreur : {error}</p>
    {:else if results.length === 0}
        <p>Aucun résultat</p>
    {:else}
        <u>
            {#each results as result}
                <li>{result.title}</li>
            {/each}
        </u>
    {/if}
</section>