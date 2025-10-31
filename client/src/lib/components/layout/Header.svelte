<script>
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import Icon  from '@iconify/svelte';

    let currentPath;
    // Réactivité automatique avec $:
    $: currentPath = $page.url.pathname

</script>

<header>
    <div class="header_title">
        <h1>BlaBlaBook</h1>
        <Icon icon="ion:book" height = 50 width= 50 />
    </div>
    {#if currentPath === '/page-user'}
        <!-- a migrer en composant pour afficher selon la route front 
             il est sur les routes user, search,book, admin
        -->
        <div class="header_search">
            <input type="text">
            <input id="author" type="radio">
            <label for="author"></label>
            <input type="radio">
        </div>  
    {/if}
    {#if currentPath === '/'}
    <button on:click={()=> goto('page-log')}>S'inscrire</button>
    <button on:click={()=> goto('page-log')}>Se Connecter</button>
    {/if}
</header>


<style>
    header{
        border: 1px solid black;
        color: #fff;
        background-color: var(--color-header-footer);
        padding: 1rem;
    }
    .header_title{
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
    }

    h1{
        
        margin-right: 1rem;
        font-size: 3rem;
    }
    button{
        padding: 0.5rem;
        background-color: #CAD2C5;
        color: var(--color-text-main);
    }
</style>