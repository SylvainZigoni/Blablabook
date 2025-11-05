<script>
    let formData = {
        username : "",
        email: "",
        password : "",
        confirm : ""
    };

    let error = "";
    let username = "";
    let email = "";

    async function handleSubmit(event) {
        event.preventDefault();

        if (formData.password !== formData.confirm) {
            error = "Les mots de passe ne correspondent pas";
            return;
        }
    
    try {
        const response = await fetch(`${import.meta.env.VITE_API_PUBLIC_URL}/auth/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                confirm: formData.confirm 
            })
        });

        if (!response.ok){
            const data = await response.json();
            error = data.error;
            return
        }

        const data = await response.json();
        console.log(data);
        username = data.username;
        email= data.email;

    setTimeout(() => {
      window.location.href = '/';
    }, 5000);

    } catch(error) {
        console.error("Erreur de connection", error)
    }
    }
</script>



<div class="register-container">

    <h2 class="inscription-title">Formulaire d'inscription</h2>


    <form on:submit={handleSubmit} method="POST">
        {#if error}
            <p class ="error">Erreur de connexion</p>
        {/if}

        <fieldset class= "register-container--fieldset">
            <div class="form-row">
                <label class="label" for="username">Votre nom d'utilisateur :</label>
                <input class="input-field" type="text" name="username" id="username" bind:value={formData.username} placeholder="Votre nom d'utilisateur" required>
            </div>

            <div class="form-row">
                <label class="label" for="email">E-mail :</label>
                <input class="input-field" type='email' name="email" id="email" bind:value={formData.email} placeholder="Votre email" required>
            </div>

            <div class="form-row">
                <label class="label" for="password">Mot de passe :</label>
                <input class="input-field" type="password" name="password" id="password" bind:value={formData.password} placeholder="Votre mot de passe" required>
            </div>

            <div class="form-row">
                <label class="label" for="confirm_password">Confirmer votre mot de passe :</label>
                <input class="input-field" type="password" name="confirm_password" bind:value={formData.confirm} id="confirm_password" placeholder="Votre mot de passe" required>
            </div>

            {#if username}
                <p class = "confirmation-message">Le compte {username} avec l'email {email} a bien été créé</p>
            {/if}

            <div class="buttons-container">
                <button class= "button" type="submit">S'inscrire</button>
                <input class= "button"type="reset" value="Réinitialiser">
                <a class= "button hyperlink_button" href="/">Retour à l'accueil</a>
            </div>
        </fieldset>
    </form>
</div>


<style>

.register-container {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden; /* Empêche le défilement horizontal */
}

.inscription-title{
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

.register-container--fieldset{
    border: 1px solid var(--color-main);
    background-color: var(--color-secondary);
    text-align: center;
    border-radius: var(--border-radius);
    padding-bottom: 1rem;
}

a {
    text-decoration: none;

}

button,
input[type="reset"],
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


.confirmation-message{
    background-color: var(--color-header-footer);
    padding: 0.5rem;
    color : var(--color-main);
    margin: 0 1rem 0 1rem;
    border-radius: var(--border-radius);
}

/* Ajout d'une media query pour ajuster la largeur des labels en mobile */
@media (max-width: 400px) {
    .form-row {
        padding: 0.5rem; /* Réduit le padding en mode mobile */
    }
    
    .register-container--fieldset {
        padding: 0.25rem; /* Réduit le padding en mode mobile */
    }
    
    form {
        padding: 0.5rem; /* Réduit le padding en mode mobile */
    }
}
</style>