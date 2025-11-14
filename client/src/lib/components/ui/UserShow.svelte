<script>
    import DeleteBookButton from "./DeleteBookButton.svelte";
    import UpdateButton from "./UpdateButton.svelte";

    export let user;
    export let onDelete;
    export let onUpdate;
</script>

<article>
    <div class="info_container">
        <h3>User</h3>
        <p><strong>id :</strong>{user.id}</p>
        <p><strong>username :</strong>{user.username}</p>
        <p><strong>email :</strong>{user.email}</p>
        <p><strong>is_admin :</strong>{user.is_admin}</p>
    </div>
    <div class="button_container">
        <DeleteBookButton onDelete={() => {onDelete(user.id);}}/>
        <UpdateButton
            user = { user};
            onClick ={()=> onUpdate(user)}/>
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
        width: 70%;
        padding: 1rem;
        margin: 1rem auto;
        gap: 5rem;
    }

    .info_container{
        display: flex;
        gap: 1rem;
    }
</style>