<script>
    import BookShow from "$lib/components/ui/BookShow.svelte";
    //cette ligne permet de **recevoir les données** injectées par la fonction `load()` dans `+page.js`.
    // Dans SvelteKit, `data` contient tout ce que tu retournes depuis `load()`.
    export let data;
    const books = data.books;
</script>


<h2>BlaBlaBook – Partagez vos lectures, vos envies, vos découvertes</h2>

<BookShow books = {books}/>






<style>

</style>