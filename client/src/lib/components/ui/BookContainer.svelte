<script>
	import AddBookButton from "$lib/components/ui/AddBookButton.svelte";
	import DeleteBookButton from "$lib/components/ui/DeleteBookButton.svelte";
	import StatusButton from "$lib/components/ui/StatusButton.svelte";
    import {page} from "$app/stores"
    export let book;


console.log("Book depuis la page de livre",book)

</script>

<article class="book-container--title">
    <h2 class="book-container--title">Titre du livre</h2>
    <div class="book-container--elements">
        <div class="book-container--elements-imgBtn">
            <img src="" alt="">
            <div class="book-container--elements-btn">
                <!-- <StatusButton /> -->
                <!-- {#if "livre dans bibli"}
                    <DeleteBookButton />
                {/if}
                {#if "livre pas dans bibli"}
                    <AddBookButton />
                {/if}
            </div> -->
        </div>
        <div class="book-container--elements-info">
            <p>Auteur(s)</p>
            <p>Genre</p>
            <p>Date de parution</p>
            <p>Résumé</p>
        </div>
    </div>
</article>

<style>

</style>