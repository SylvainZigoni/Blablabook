<script>
    import {page} from '$app/stores';
    import { DeleteCategory, getAllCategories } from '$lib/api/categories/categories';
    import CategoryShow from './CategoryShow.svelte';
    import UpdateForm from './UpdateForm.svelte';

    export let token;
    // console.log(token);
    // $: console.log("categories dans composant", categories);

    $: filter = $page.url.searchParams.get("filter");

   

    let categories = [];

    async function loadCategories() {
        try {
            const data = await getAllCategories();
            // console.log("Résultat API", data);
            categories = data;
        } catch (err) {
            console.error("Erreur fetch :", err);
            categories =[];
        }
    }

    async function handleDeleteCategory(category_id){
        try {
            const result = await DeleteCategory(category_id, token);
            // console.log('delete ok', result);
        } catch (error) {
            console.error("Erreur de delete :", error);
        }
    }

    $: if(filter === "categories"){
        loadCategories();
    }

    let showModal = false;
    let selectedCategory = null;

    // NEW: ouvrir le modal avec la catégorie
    function handleUpdate(category) {
        selectedCategory = category;
        showModal = true;
        console.log('selectedCategory', selectedCategory);
    }

    // NEW: fermer le modal
    function closeModal() {
        showModal = false;
        selectedCategory = null;
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
                    <CategoryShow
                    category = {category}
                    onDelete = {handleDeleteCategory}
                    onUpdate = {handleUpdate}
                    />                    
                {/each}
            </ul>
        {/if}
    </section>

    {#if showModal} <!-- NEW -->
        <div class="modal-backdrop" on:click={closeModal}></div>
        <div class="modal">
            <UpdateForm
            category={selectedCategory}
            token={token}
            onClose={closeModal}
            onSubmitted={async () => { //callback après PATCH réussi
                    await loadCategories();
                    closeModal();
            }}
            />
        </div>
    {/if}
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

    /* Modal CSS */
    .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
    }

    .modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2rem;
        border-radius: 8px;
        z-index: 10;
    }
</style>