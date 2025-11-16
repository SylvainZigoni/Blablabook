<script>
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import Icon  from '@iconify/svelte';
    import Search from "../ui/Search.svelte";
	// import { onDestroy, onMount } from "svelte";
	import UserButton from "../ui/UserButton.svelte";


    let currentPath;
    // Réactivité automatique avec $:
    $: currentPath = $page.url.pathname


    function handleClick(){
        goto('/')
        return;
    }

</script>

<header>
    <div class="header">
        <div class="header_home">
            <div class="header_title_user">
                <div  class="header_title" on:click={handleClick}>
                    <h1>BlaBlaBook</h1>
                    <Icon icon="ion:book" height = 50 width= 50 />
                </div>
                {#if $page.data.token}
                    <UserButton />
                {/if}
            </div>


            {#if !$page.data.token}
                <div class="login_register-button">
                    <button on:click={()=> goto('register')}>S'inscrire</button>
                    <button on:click={()=> goto('login')}>Se connecter</button>
                </div>
            {/if}
        </div>
        {#if $page.data.token}
            <div class="header_search">
                <Search/>
            </div>
        {/if}
    </div>

</header>

<style>
    header{
        /* border: 1px solid black; */
        color: #fff;
        background-color: var(--color-header-footer);
        padding: 1rem;
        /* border-bottom-left-radius: var(--border-radius);
        border-bottom-right-radius: var(--border-radius); */
        box-shadow: var(--shadow);
    }

    .header_home{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap : 10px

    }
    .header_title{
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
        filter: drop-shadow(1px 1px 2px var(--color-main))
    }

    .header_title:hover{
        cursor:pointer;
        scale: 1.01;
    }

    .header_title_user{
        display: flex;
        justify-content: space-between;
    }

    h1{
        
        margin-right: 1rem;
        font-size: 3rem;
    }
    /* button{
        padding: 0.5rem;
        background-color: #CAD2C5;
        color: var(--color-text-main);
    } */

    .header{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        /* max-width: 300px; */
    }

    .login_register-button {
        /* display: flex;
        justify-content: space-between;
        max-width: 100%; */

    }

    .header_search{
        /* display: flex;
        flex-wrap: wrap;
        justify-content: space-between; */

    }



    /* Media query pour les écrans < 400px */
    @media (max-width: 400px) {

        .header{
            margin: 0 auto;
        }

        h1{
            font-size: 2.5rem;
        }

        .header_title {
            justify-content: center; /* Centre les éléments */
        }

        .login_register-button {
            justify-content: center;
            gap: 1rem; /* Ajoute un espace entre les boutons */
        }

        /* .header_home {
            display: flex;

        } */
    }

</style>

