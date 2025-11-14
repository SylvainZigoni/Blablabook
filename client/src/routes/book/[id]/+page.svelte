<script>
	import BookContainer from "$lib/components/ui/BookContainer.svelte";
    export let data;
    const {book} = data;

</script>


<BookContainer {book} />


<style>

</style>