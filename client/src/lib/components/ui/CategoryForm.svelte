<script>
    import { CategoryUpdate, CategoryCreate} from "$lib/api/categories/categories";

    export let token;
    export let category = null;
    export let mode;
    export let onClose;
    export let onSubmitted;

    let name = category?.name ?? '';

    async function submit(){
        try {
            if (mode === "create") {
                await CategoryCreate({ name }, token);
            } else if (mode === "update") {
                await CategoryUpdate(category.id, { oldName: category.name, newName: name }, token);
            }
            await onSubmitted();
        } catch (error) {
            console.error("Erreur formulaire catégorie :", error);
        }
    }    
</script>

<form on:submit|preventDefault={submit}>
  <h3>{mode === "create" ? "Ajouter une catégorie" : "Modifier la catégorie"}</h3>
  <label for="name">{mode === "create" ? "" : `Nom actuel : ${category?.name}`}</label>
  <input id="name" type="text"  placeholder="Nom de la catégorie" bind:value={name}/>
  <div>
    <button type="submit">{mode === "create" ? "Créer" : "Mettre à jour"}</button>
    <button type="button" on:click={onClose}>Annuler</button>
  </div>
</form>

<style>
    form {
        display: flex;
        flex-direction: column;
    }
</style>