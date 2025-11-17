<script>
    import { BookCreate } from "$lib/api/books/books";
    import { CategoryCreate } from "$lib/api/categories/categories";

    export let token;

    export let categories = [];
    export let authors = [];

    export let book = null;
    export let mode;
    export let onClose;
    export let onSubmitted;

    let title = book?.title ?? '';
    let summary = book?.summary ?? '';
    let date_parution = book?.date_parution ?? '';
    let category_id = null;
    let author_id = null;

    async function submit(){
        try {
            if (mode === "create") {
                
                //console.log("title:", title, typeof title);
                //console.log("date_parution:", date_parution, typeof date_parution);
                //console.log("categoryId:", category_id, typeof category_id);
                //console.log("authorId:", author_id, typeof author_id);

                console.log(`titre ${title}, date ${date_parution}, category id ${category_id}, author id ${author_id}`)
                await BookCreate({ title,summary, date_parution, categoryId:category_id, authorId:author_id}, token);
            } else if (mode === "update") {
                await UserUpdate(user.id, { title, date_parution}, token);
            }
            await onSubmitted();
        } catch (error) {
            console.error("Erreur formulaire catégorie :", error);
        }
    }

</script>

<form on:submit|preventDefault={submit}>
    <h3>{mode === "create" ? "Ajouter un livre" : "Modifier un livre"}</h3>
    <div class="field">
        <label for="title">{mode === "create" ? "Titre du livre :" : `Titre actuel : ${book?.title}`}</label>
        <input id="title" type="text"  placeholder="Entrez un titre" bind:value={title}/>
    </div>
   
    <div class="field">
        <label for="summary">{mode === "create" ? "Résumé :" : `Résumé actuel :`}</label>
        <textarea id="summary" placeholder="Entrez votre résumé" bind:value={summary}></textarea>
    </div>

    <div class="field">
        <label for="date_parution">{mode === "create" ? "Date de parution :" : `Date de parution actuelle : ${book?.date_parution}`}</label>
        <input id="date_parution" type="date"  placeholder="jj/mm/yyyy" bind:value={date_parution}/>
    </div>
    <div class="field">
        <label for="category">Catégories : </label>
        <select name="category" id="category" bind:value={category_id}>
            <option value="" disabled>Choisir la catégorie</option>
            <option value="null">Aucune des catégories proposées</option>
            {#each categories as category }
                <option value= {category.id}>{category.name}</option>
            {/each}

        </select>
    </div>
    <div class="field">
        <label for="author">Auteur : </label>
        <select name="author" id="author" bind:value={author_id}>
            <option value="" disabled>Choisir un Auteur</option>
            <option value="null">Aucune des auteurs proposés</option>
            {#each authors as author }
                <option value= {author.id}>{author.name}</option>
            {/each}

        </select>
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

    input[type="checkbox"] {
        /* Annule le reset des inputs dans app.css*/
        appearance: auto; /* remet le style natif */
        -webkit-appearance: checkbox; /* pour Safari */
        -moz-appearance: checkbox;    /* pour Firefox */
        width: 16px;
        height: 16px;
}
</style>