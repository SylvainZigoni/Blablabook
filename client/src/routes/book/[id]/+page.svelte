<script>
	import BookContainer from "$lib/components/ui/BookContainer.svelte";
    export let data;


</script>


<BookContainer book={data.book} user_id={data.user_id} token={data.token} />


<style>

</style>