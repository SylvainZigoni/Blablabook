<script>
    import Icon from "@iconify/svelte";
    export let onDelete;
</script>

<button on:click={() => {
    console.log("clic sur le bouton DeleteBookButton");
    onDelete();
}}>
    <Icon icon="material-symbols:delete" height = 25 width= 25 />
</button>


<style>
    
</style>