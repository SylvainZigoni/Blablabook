<script>
    import { AuthorCreate , AuthorUpdate } from "$lib/api/authors/authors";

    export let token;
    export let author = null;
    export let mode;
    export let onClose;
    export let onSubmitted;

    let name = author?.name ?? '';
    let forname = author?.forname ?? '';

    console.log('name', name);
    console.log('forname', forname);
    
    async function submit(){
        try {
            if (mode === "create") {
                await AuthorCreate({ name , forname }, token);
            } else if (mode === "update") {
                await AuthorUpdate(author.id, { name , forname }, token);
            }
            await onSubmitted();
        } catch (error) {
            console.error("Erreur formulaire catégorie :", error);
        }
    }    
</script>

<form on:submit|preventDefault={submit}>
    <h3>{mode === "create" ? "Ajouter un auteur" : "Modifier l'auteur"}</h3>
    <div class="field">
        <label for="forname">{mode === "create" ? "Prenom de l'auteur :" : `Prenom actuel : ${author?.name}`}</label>
        <input id="forname" type="text"  placeholder="Entrez le prenom" bind:value={forname}/>
    </div>
    <div class="field">
        <label for="name">{mode === "create" ? "Nom de l'auteur :" : `Nom actuel : ${author?.name}`}</label>
        <input id="name" type="text"  placeholder="Entrez le nom" bind:value={name}/>
    </div>
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

    .field{
        display: flex;
        flex-direction: column;
        margin-bottom: 1rem;
    }

</style>