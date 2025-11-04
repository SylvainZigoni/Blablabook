<script>
    import BookShow from "./BookShow.svelte";


    // le composant attends qu'on lui passe une variable books depuis l'exterieur
    // sur la page ou il est utilise on a <Home books = {books}/>
    export let books=[];   
</script>

<div class="home_container">

<h2><strong>BlaBlaBook –</strong>  Partagez vos lectures, vos envies, vos découvertes</h2>
<p>
    Plongez dans l’univers de BlaBlaBook, votre bibliothèque personnelle en ligne.
    <strong>Créez un compte</strong> et accédez à une collection de livres soigneusement sélectionnés par des passionnés de lecture.
    Gérez vos lectures, suivez votre progression et organisez vos coups de cœur en quelques clics.
</p>

<section>
    {#each books as book }
    <BookShow {book}/>
    {/each}
</section>

</div>

<style>
    .home_container{
        padding: 1rem;
        display: flex;
        flex-direction: column;
    }

    h2{
        margin-bottom: 1rem;

    }

    h2 strong{
        font-weight: bolder;
        font-size: 2rem;
    }

    p strong{
        font-weight: bolder;
    }
</style>