<script>
    import Icon from "@iconify/svelte";
    
    export let onDelete;
</script>

<button class="book-delete" aria-label="Supprimer de la bibliothèque" on:click={() => {onDelete();}}>
    <Icon icon="material-symbols:delete" height = 20 width= 20/>
</button>

<style>
    .book-delete{
        background-color: var(--color-delete);
        color : var(--color-main);
        padding: 2px;
        padding-top: 3px;
        width: 40px;
        height : 40px;
        align-self: center;
        margin: auto;
    }

    .book-delete:hover, .book-delete:focus {
        background-color: var(--color-delete-hover);
        transform: scale(1.03);
        box-shadow: 0 4px 10px rgba(0,0,0,0.08);
    }

    .book-delete:active {
        transform: translateY(0) scale(0.99);
        box-shadow: none;
    }
</style>