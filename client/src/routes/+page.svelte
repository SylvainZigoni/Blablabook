<script>
    import Home from "$lib/components/ui/Home.svelte";
    //cette ligne permet de **recevoir les données** injectées par la fonction `load()` dans `+page.js`.
    // Dans SvelteKit, `data` contient tout ce que tu retournes depuis `load()`.
    export let data;

    $: ({ user_id, token } = data);
    $: (console.log("mon token", token))

</script>

<Home books={data.books} token={token} />


<style>

</style>