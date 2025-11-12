<script>
    import Icon from "@iconify/svelte";
    export let onAdd;
</script>

<button on:click={() => {onAdd();}}>
    <Icon icon="bxs:book-add" width="24" height="24" />
</button>

<style>

</style>