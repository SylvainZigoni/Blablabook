<script>


</script>



<div class="register-container">

    <h2 class="inscription-title">Formulaire d'inscription</h2>


    <form action="" method="POST" enctype="????">
        <p>Message en cas d'erreur</p>
        <fieldset class= "register-container--fieldset">
            <div class="form-row">
                <label class="label" for="username">Votre nom d'utilisateur :</label>
                <input class="input-field" type="text" name="username" id="username" placeholder="Votre nom d'utilisateur" required>
            </div>

            <div class="form-row">
                <label class="label" for="email">E-mail :</label>
                <input class="input-field" type='email' name="email" id="email" placeholder="Votre email" required>
            </div>

            <div class="form-row">
                <label class="label" for="password">Mot de passe :</label>
                <input class="input-field" type="password" name="password" id="password" placeholder="Votre mot de passe" required>
            </div>

            <div class="form-row">
                <label class="label" for="confirm_password">Confirmer votre mot de passe :</label>
                <input class="input-field" type="password" name="confirm_password" id="confirm_password" placeholder="Votre mot de passe" required>
            </div>

            <div class="buttons-container">
                <button class= "button" type="submit">S'inscrire</button>
                <input class= "button"type="reset" value="Réinitialiser">
                <a class= "button hyperlink_button" href="/">Retour à l'accueil</a>
            </div>
        </fieldset>
    </form>
</div>


<style>

.inscription-title{
    text-align: center;
}


.form-row{
    display: flex;
    flex-direction: column;
    padding: 1rem;
    
}

.input-field{
    height: 2.5rem;
    border-radius: var(--border-radius);
    background-color: var(--color-main);
    padding: 0 1rem;
}

.register-container--fieldset{
    border: 1px solid var(--color-main);
    background-color: var(--color-secondary);
    text-align: center;
    border-radius: var(--border-radius);
    padding: 1rem;

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
    width: 200px; /* Largeur fixe pour tous les boutons */
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
}

form {
    padding: 1rem;
    max-width: 600px;
    margin: auto;
}
</style>