<!-- Nous sommes sur une route "slug" car dans le dossier id est entre [], cela permet d'ecrire une fois le code qui sera à toute les page /book/bookid -->



<script>
	import BookContainer from "$lib/components/ui/BookContainer.svelte";
    export let data;


</script>


<BookContainer book={data.book} user_id={data.user_id} token={data.token} />


<style>

</style>