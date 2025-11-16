<script>
    import { enhance } from '$app/forms';
    export let form;

</script>

<div class="login-container">

    <h2 class="connection-title">Connexion</h2>

    <!-- A la place d'un "on:submit ={fonction}" on utilise action="?/login"-->
    <!-- Ca nous renvoie vers la page.server.js du dossier qui appelle le composant -->
    <!-- Dedans on y trouve la variable action avec la method login -->

    <form method="POST" action="?/login" use:enhance>
        <fieldset class= "login-container--fieldset">
            <div class="form-row">
                <label class="label" for="username">Votre nom d'utilisateur :</label>
                <!-- On n'utilise pas les "bind:value={formData.username}" par username est déja récupérer via le action -->
                <input class="input-field" type="text" name="username" id="username" placeholder="Votre nom d'utilisateur" required>
            </div>

            <div class="form-row">
                <label class="label" for="password">Mot de passe :</label>
                
                <input class="input-field" type="password" name="password" id="password" placeholder="Votre mot de passe" required>
            </div>


            <div class="buttons-container">
                <button class= "button" type="submit">Se connecter</button>
                <a class= "button hyperlink_button" href="/">Retour à l'accueil</a>
            </div>
        </fieldset>
    </form>

    {#if form?.error}
        <p class="error">{form.error}</p>
    {/if}
</div>



<style>

.login-container {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden; /* Empêche le défilement horizontal */
}

.connection-title{
    text-align: center;
}


.form-row{
    max-width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    
}

.input-field{
    height: 2.5rem;
    border-radius: var(--border-radius);
    background-color: var(--color-main);
    padding: 0 1rem;
    box-shadow: var(--shadow);
}

.login-container--fieldset{
    border: 1px solid var(--color-main);
    background-color: var(--color-secondary);
    text-align: center;
    border-radius: var(--border-radius);
    padding-bottom: 1rem;
}

.error {
    max-width: 800px;
    margin:auto;
}

a {
    text-decoration: none;

}

button,
.button {
    /* Reset des styles par défaut */
    border: none;
    margin: 0;
    font: inherit;
    cursor: pointer;
    outline: none;
    appearance: none;
    
    /* Styles communs */
    background-color: var(--color-text-main);
    padding: 0.5rem 2rem;
    color: var(--color-main);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    font-size: 1rem;
    line-height: 1;
    width: auto; /* Largeur fixe pour tous les boutons */
    height: 40px; /* Hauteur fixe pour tous les boutons */
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.5rem;
}

.button:hover{
    background-color: var(--color-main);
    color: var(--color-text-main);
    scale: 1.03;
}
.buttons-container{
    margin-top: 2rem;
    display: flex;
    gap : 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

label {
    margin-bottom: 1rem;
    font-weight: 600;
    color : var(--color-text-main);
    display: block;
    max-width: 100%;
    overflow-wrap: break-word;
    word-break: break-word;

}

form {
    padding: 1rem;
    max-width: 800px;
    margin: auto;

}

/* Ajout d'une media query pour ajuster la largeur des labels en mobile */
@media (max-width: 400px) {
    .form-row {
        padding: 0.5rem; /* Réduit le padding en mode mobile */
    }
    
    .login-container--fieldset {
        padding: 0.25rem; /* Réduit le padding en mode mobile */
    }
    
    form {
        padding: 0.5rem; /* Réduit le padding en mode mobile */
    }
}

</style>