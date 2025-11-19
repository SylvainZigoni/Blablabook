<script>
    import Icon from "@iconify/svelte";
    import { page } from "$app/stores";
    export let isOpen = false;
    export let onLogout;
    export let isAdmin = false

</script>




<!-- class:open={isOpen} permet d'ajouter ".open" a notre class quand la variable isOpen = true  -->
<div class="dropdown" class:open={isOpen}>
    <div class="dropdown-container">
        {#if isAdmin}
            <a href="/administrator" class="dropdown-item"><Icon icon="dashicons:admin-network" width="16" height="16" /> Admin</a>
        {/if}
        <a href={`/user/${$page.data.user_id}`} class="dropdown-item"><Icon icon="ion:library" width="16" height="16" /> Ma bibliothèque</a>
        <button on:click={onLogout} class="dropdown-item" aria-label="Se deconnecter"><Icon icon="fluent:plug-disconnected-16-filled" width="16" height="16" /> Se deconnecter</button>
    </div>
</div>

<style>
    .dropdown{
        display: none;
        position: absolute;
        margin-right: 5px;
        right: 10px;
        background-color: var(--color-main);
        border-radius: 4px;
        box-shadow: var(--shadow);
        z-index: 100;
    }

    .dropdown-container{
        padding: 10px;
    }

    .dropdown.open{
        display: block;
    }

    .dropdown-item{
        display: block;
        width: 100%;
        padding: 8px 16px;
        text-align: left;
        cursor: pointer;
    }

    .dropdown-item:hover{
        transform: scale(1.03);
        text-decoration: underline ;
        
    }

</style>