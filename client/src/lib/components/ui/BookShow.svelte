<script>
    // le composant attends qu'on lui passe une variable books depuis l'exterieur
    // sur la page ou il est utilise on a  {#each books as book}
    export let book;

    import { page } from "$app/stores";
    let currentPath;
    // Réactivité automatique avec $:
    $: currentPath = $page.url.pathname
</script>

<article>
        <img src={`${import.meta.env.VITE_API_PUBLIC_URL}/images/${book.image_url}`} alt= {book.title}>
        <div class="book_infos">
            <h3>titre : {book.title}</h3>
            <strong>auteur : a recuperer avec include {book.author}</strong>
            <strong>date de publication : {book.date_parution}</strong>
            <strong> Genre : a recuperer avec include { book.category }</strong>
        </div>
        <p class="book_summary">Résumé : { book.summary} </p>
     <!-- Faire un composant pour afficher ailleurs ne pas afficher sur cette page 
        {#if currentPath === '/page-login'}
            <div class="book_status">
            <select name="" id="">
                <option value="" disabled selected>Choisir le status de Lecture</option>
                <option value="">Lecture en cours</option>
                <option value="">A lire</option>
                <option value="">Lu</option>
            </select>
        </div>
        {/if} -->
    
</article>

<style>
    article {
    display: flex;
    gap: 2rem;
    align-items: stretch;
    margin: 2rem;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: var(--color-main);
    height: 15vh; /*  15% de la hauteur de la fenêtre */
    overflow: hidden; /*  évite les débordements */
    }

    img {
        height: 100%; /* ✅ remplit toute la hauteur de l’article */
        width: auto; /* ✅ conserve les proportions */
        object-fit: cover;
        border: 1px solid var(--color-border-main);
        border-radius: 8px;
    }

    .book_infos {
        padding: 1rem;
        max-height: 100%;
        display: flex;
        flex-direction: column;
    }

    .book_summary{
        border: 1px solid aqua;
        padding: 1rem;
        border: 1px solid var(--color-border-main);
        border-radius: 8px;
        background-color: var(--color-secondary);
        max-height: 100%;

    }

    .book_status{
        align-self: center;
    }
</style>