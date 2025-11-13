<script>
    import {page} from '$app/stores';
    import { DeleteCategory, getAllCategories } from '$lib/api/categories/categories';
    import CategoryShow from './CategoryShow.svelte';

    export let token;
    export let onDelete;

    $: console.log("categories dans composant", categories);

    $: filter = $page.url.searchParams.get("filter");

    function filterChange(type){
        console.log("filter", type);
    }

    let categories = [];

    async function loadCategories() {
        try {
            const data = await getAllCategories();
            console.log("Résultat API", data);
            categories = data;
        } catch (err) {
            console.error("Erreur fetch :", err);
            categories =[];
        }
    }

    async function HandleDeleteCategory(category_id){
        try {
            const result = await DeleteCategory(category_id, token);
            console.log('delete ok', result);
        } catch (error) {
            console.error("Erreur de delete :", error);
        }
    }

    $: if(filter === "categories"){
        filterChange(filter);
        loadCategories();
    }

</script>

<div class="admin_container">
    <h2>Administration de l'application</h2>
    <div class="filter_container">
        <ul class="link_filter">
            <li><a href="?filter=users" class:active={filter === 'users'}>Gestion des Utilisateurs</a></li>
            <li><a href="?filter=books" class:active={filter === 'books'}>Gestion des Livres</a></li>
            <li><a href="?filter=authors" class:active={filter === 'authors'}>Gestion des Auteurs</a></li>
            <li><a href="?filter=categories" class:active={filter === 'categories'}>Gestion des Genres</a></li>
        </ul>
    </div>
    <button class="admin_button">Ajouter</button>
    <section class="filter_container">
        {#if filter === "users"  }
            <p>Users</p>
        {/if}
        {#if filter === "books"  }
            <p>Books</p>
        {/if}
        {#if filter === "authors"  }
            <p>Authors</p>
        {/if}
        {#if filter === "categories"  }
            <ul>
                {#each categories as category }
                    <!-- <li> {category.id} - {category.name}</li> -->
                    <CategoryShow 
                    category = {category}
                    onDelete = {HandleDeleteCategory}
                    />
                {/each}
            </ul>
        {/if}
    </section>
</div>

<style>
    .admin_container{
        display: flex;
        flex-direction: column;
    }
    .admin_button{
        width: 50%;
        align-self: center;
    }

    .active{
        text-decoration: underline;
        font-size: large;
    }
</style>