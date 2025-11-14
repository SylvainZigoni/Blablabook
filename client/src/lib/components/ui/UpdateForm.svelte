<script>
    import { CategoryUpdate} from "$lib/api/categories/categories";
    export let category;
    export let token;
    export let onClose;
    export let onSubmitted;

    let name = category?.name ?? '';

    async function submit(){
        try {
            await CategoryUpdate(category.id, {
                oldName : category.name,
                newName : name
            },
        token);

        await onSubmitted();

        } catch (error) {
            console.error('Erreur du PATCH', error);
        }        
    }
</script>

<form on:submit|preventDefault={submit}>
    <h3>Modifier la catégorie : {category.id}</h3>
    <label for="name">Name : {category.name}</label>
    <input id="name" type="text" bind:value={name}>

    <div>
        <button type="submit">Valider</button>
        <button type="button" on:click={onClose}>Annuler</button>
    </div>
</form>

<style>
    form {
        display: flex;
        flex-direction: column;
    }
</style>