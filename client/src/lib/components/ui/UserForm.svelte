<script>
    import { UserCreate, UserUpdate } from "$lib/api/users/users";

    export let token;
    export let user = null;
    export let mode;
    export let onClose;
    export let onSubmitted;

    let username = user?.username ?? '';
    let email = user?.email ?? '';
    let is_admin = user?.is_admin;
    async function submit(){
        try {
            if (mode === "create") {
                await UserCreate({ username, email, is_admin }, token);
            } else if (mode === "update") {
                await UserUpdate(user.id, { username, email, is_admin }, token);
            }
            await onSubmitted();
        } catch (error) {
            console.error("Erreur formulaire catégorie :", error);
        }
    }  
</script>

<form on:submit|preventDefault={submit}>
    <h3>{mode === "create" ? "Ajouter un utilisateur" : "Modifier un utilisateur"}</h3>
    <div class="field">
        <label for="username">{mode === "create" ? "" : `Username actuel : ${user?.username}`}</label>
        <input id="username" type="text"  placeholder="username de l'utilisateur" bind:value={username}/>
    </div>
   
    <div class="field">
        <label for="email">{mode === "create" ? "" : `email actuel : ${user?.email}`}</label>
        <input id="email" type="email"  placeholder="email" required bind:value={email}/>
    </div>
    <div class="field">
        <label for="is_admin">
            Administrateur ?
            <input type="checkbox" bind:checked={is_admin}>
        </label>
    </div>
    <!-- <div class="field">
        <label for="is_admin">{mode === "create" ? "" : `is_admin actuel : ${user?.is_admin}`}</label>
        <input id="is_admin" type="text"  placeholder="true ou false" bind:value={is_admin}/>
    </div> -->
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