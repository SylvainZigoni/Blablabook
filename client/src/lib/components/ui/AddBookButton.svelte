<script>
    import Icon from "@iconify/svelte";
    export let onAdd;
</script>

<button class="book-add" aria-label="Ajouter à la bibliothèque" on:click={() => {onAdd();}}>
    <Icon icon="bxs:book-add" width="20" height="20" />
</button>

<style>
    .book-add{
        background-color: var(--color-header-footer);
        padding: 2px;
        padding-top: 3px;
        width: 40px;
        height : 40px;
        align-self: center;
        margin: auto;
    }

    .book-add:hover, .book-add:focus {
        background-color: var(--color-text-main);
        transform: scale(1.03);
        box-shadow: 0 4px 10px rgba(0,0,0,0.08);
    }

    .book-add:active {
        transform: translateY(0) scale(0.99);
        box-shadow: none;
    }
</style>