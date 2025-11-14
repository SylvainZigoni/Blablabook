<script>
    import DeleteBookButton from "./DeleteBookButton.svelte";
    import UpdateButton from "./UpdateButton.svelte";

    export let category;
    export let onDelete;
    export let onUpdate;
</script>

<article>
    <div class="info_container">
        <h3>Category</h3>
        <p><strong>id :</strong>{category.id}</p>
        <p><strong>name :</strong>{category.name}</p>
    </div>
    <div class="button_container">
        <DeleteBookButton onDelete={() => {onDelete(category.id);}}/>
        <UpdateButton
            category = { category};
            onClick ={()=> onUpdate(category)}/>
    </div>
</article>

<style>
article{
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        background-color: var(--color-main);
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100px;
        width: 50%;
        padding: 1rem;
        margin: 1rem auto;
        gap: 5rem;
    }

    .info_container{
        display: flex;
        gap: 1rem;
    }

    .button_container{

    }
</style>
