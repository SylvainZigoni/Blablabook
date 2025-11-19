<script>
    import Icon from "@iconify/svelte";
    
    export let onUpdate;
    export let onClick;
    
</script>

<button class="book-delete" aria-label="mettre a jour" on:click={onClick} >
    <Icon icon="icon-park-solid:update-rotation" height = 20 width= 20/>
</button>


<style>
    .book-delete{
        background-color: var(--color-header-footer);
        padding: 2px;
        padding-top: 3px;
        width: 40px;
        height : 40px;
        align-self: center;
        margin: auto;
    }

    .book-delete:hover, .book-delete:focus {
        background-color: var(--color-text-main);
        transform: scale(1.03);
        box-shadow: 0 4px 10px rgba(0,0,0,0.08);
    }

    .book-delete:active {
        transform: translateY(0) scale(0.99);
        box-shadow: none;
    }


    .popup-form {
    border: 1px solid #ccc;
    padding: 1rem;
    background: white;
    position: absolute;
    top: 20%;
    left: 30%;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  }
</style>