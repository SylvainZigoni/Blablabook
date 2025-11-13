<script>
    import UserDropdown from "./UserDropdown.svelte";
    import { onMount } from "svelte";
    import Icon from "@iconify/svelte";
	import { goto } from "$app/navigation";

    let isDropdownOpen = false;

    async function handleLogout() {
        // Appel vers le backend de svelte pour supprimer les cookies (accessibles seulement coté back)
        await fetch('/api/logout', {method: 'POST'})
        isDropdownOpen = false;
        goto('/');
    }


    function handleClickOutside(event) {
        const dropdown = document.querySelector('.dropdown');
        const button = document.querySelector('.user-button');

        // Si le clic utilisateur est en dehors de la popup et en dehors du bouton, alors on passe isDropdownOpen a false
        if (!dropdown?.contains(event.target) && !button?.contains(event.target)) {
            isDropdownOpen = false;
        }
    }

    onMount(()=>{
        // Mise en place d'un ecouteur d'evenement clic sur l'ensemble de la page qui execute handleClickOutside a chaque clic
        document.addEventListener('click', handleClickOutside);
    });

</script>

<button class="user-button" on:click={()=> isDropdownOpen = !isDropdownOpen}>
    <Icon icon="oui:user" height = 20 width= 20 />
</button>

<UserDropdown isOpen={isDropdownOpen} onLogout={handleLogout} />

<style>
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