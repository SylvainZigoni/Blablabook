<script>
    import DeleteBookButton from "./DeleteBookButton.svelte";
    import UpdateButton from "./UpdateButton.svelte";

    export let author;
    export let onDelete;
    export let onUpdate;
</script>

<article>
    <div class="info_container">
        <h3>author</h3>
        <p><strong>id :</strong>{author.id}</p>
        <p><strong>forname :</strong>{author.forname}</p>
        <p><strong>name :</strong>{author.name}</p>
    </div>
    <div class="button_container">
        <DeleteBookButton onDelete={() => {onDelete(author.id);}}/>
        <UpdateButton
            author = { author};
            onClick ={()=> onUpdate(author)}/>
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
