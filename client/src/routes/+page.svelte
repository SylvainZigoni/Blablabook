<script>
    import Home from "$lib/components/ui/Home.svelte";
    //cette ligne permet de **recevoir les données** injectées par la fonction `load()` dans `+page.js`.
    // Dans SvelteKit, `data` contient tout ce que tu retournes depuis `load()`.

    // export let data ca permet de récuperer les données du load() et +page.server.js et +layout.server.js et de les renvoyer à la prochaine page ou composant
    export let data;

    // Les $ permettent d'activer la réactivité des données => à chaque fois que la donnée data se met à jour, user_id et token se mettent a jour.
    $: ({ user_id, token } = data);

    // Exemple de ligne de code réactive qui s'active au changement de la variable token
    $: (console.log("mon token", token))

</script>

<Home books={data.books} token={token} />


<style>

</style>