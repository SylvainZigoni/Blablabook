<script>
    import UserDropdown from "./UserDropdown.svelte";
    import { onMount } from "svelte";
    import Icon from "@iconify/svelte";
    import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import { redirect } from "@sveltejs/kit";

    let isDropdownOpen = false;
    let isAdmin = false;

    async function handleLogout() {
        // Appel vers le backend de svelte pour supprimer les cookies (accessibles seulement coté back)
        await fetch('/api/logout', {method: 'POST'})
        isDropdownOpen = false;
    
        // Windows location permet de recharger la page et donc de raffraichir les données obtenues via le load
        window.location.href='/';
    }

    function handleClickOutside(event) {
        const dropdown = document.querySelector('.dropdown');
        const button = document.querySelector('.user-button');

        // Si le clic utilisateur est en dehors de la popup et en dehors du bouton, alors on passe isDropdownOpen a false
        if (!dropdown?.contains(event.target) && !button?.contains(event.target)) {
            isDropdownOpen = false;
        }

        // Ferme la popup si clic sur un lien <a> ou un bouton
            if (dropdown?.contains(event.target) && (event.target.closest('a') || event.target.closest('button'))) {
            isDropdownOpen = false;
            return;
        }
    }

    async function toggleDropdown(){
        if(!isDropdownOpen) {
            try {
                const res = await fetch('/api/getCookies');
                if (res.ok) {
                    const data = await res.json();
                    console.log(data)
                    isAdmin = data.is_admin === true || data.is_admin === 'true';
                } else {
                    isAdmin = false
                }
            } catch(error) {
                console.error('Erreur récupération cookies', error);
                isAdmin = false;
            }
        }
        isDropdownOpen = !isDropdownOpen;
    }


    onMount(()=>{
        // Mise en place d'un ecouteur d'evenement clic sur l'ensemble de la page qui execute handleClickOutside a chaque clic
        document.addEventListener('click', handleClickOutside);
    });

</script>

<div class="user-menu">
    <button class="user-button" on:click={toggleDropdown}>
        <Icon icon="oui:user" height = 20 width= 20 />
    </button>
    <p class="username">{$page.data.user_name}</p>
</div>

<UserDropdown isOpen={isDropdownOpen} onLogout={handleLogout} isAdmin={isAdmin} />

<style>

    .user-menu{
        margin-top: -20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .username{
        font-size: 0.6rem;
        justify-self: center;
    }

    .user-button{
 
        padding: 0;
        height: 40px;
        width: 40px;
        border-radius: 100%;
        box-shadow: var(--shadow);
    }

    .user-button:hover{
        background-color: var(--color-main);
        color : var(--color-text-main);
        transform: scale(1.03);
    }
</style>