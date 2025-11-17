<script>
    import {page} from '$app/stores';
    import { DeleteCategory, getAllCategories } from '$lib/api/categories/categories';
    import { DeleteAuthor, getAllAuthors } from '$lib/api/authors/authors';
    import { DeleteUser, getAllUsers } from '$lib/api/users/users';
    import { getAllBooks, DeleteBook } from '$lib/api/books/books';
    import CategoryShow from './CategoryShow.svelte';
    import CategoryForm from './CategoryForm.svelte';
    import UserShow from './UserShow.svelte';
    import UserForm from './UserForm.svelte';
    import BookShow from './BookShow.svelte';
    import BookForm from './BookForm.svelte';
    import AuthorShow from './AuthorShow.svelte';
    import AuthorForm from './AuthorForm.svelte';

    export let token;
    //console.log('token',token);
    // $: console.log("categories dans composant", categories);

    $: filter = $page.url.searchParams.get("filter");
    
    $: if(filter === "categories"){
        loadCategories();
    }

    $: if(filter === "authors"){
        loadAuthors();
    }

    $: if(filter === "users"){
        loadUsers();
    }

    $: if(filter === "books"){
        loadBooks();   
    }
    
    
    let showModal = false;
    let modalMode = null    // pour afficher le bon form en fonctoin create ou update
    
    // fermer le modal
    function closeModal() {
        showModal = false;
        selectedCategory = null;
        selectedUser = null;
    }
    
    
    // Gestion des Categories
    let categories = [];
    let selectedCategory = null;
    
    async function loadCategories() {
        try {
            const data = await getAllCategories(token);
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
            await loadCategories();
        } catch (error) {
            console.error("Erreur de delete :", error);
        }
    }

    // ouvrir le modal du update
    function handleUpdateCategory(category) {
        selectedCategory = category;
        modalMode = "update";
        showModal = true;
        // console.log('selectedCategory', selectedCategory);
    }

    // ouvrir le modal du create
    function handleCreateCategory() {
        selectedCategory = null;
        modalMode = "create";
        showModal = true;
    }
// Fin de gestion des Categories

// Début gestion des Users
    let users = [];
    let selectedUser = null;

    async function loadUsers() {
        try {
            const data = await getAllUsers(token);
            // console.log("Résultat API", data);
            users = data;
        } catch (err) {
            console.error("Erreur fetch :", err);
            users =[];
        }
    }

    async function handleDeleteUser(user_id){
        try {
            const result = await DeleteUser(user_id, token);
            await loadUsers();
        } catch (error) {
            console.error("Erreur de delete :", error);
        }
    }

    function handleUpdateUser(user) {
        selectedUser = user;
        modalMode = "update";
        showModal = true;
        console.log('selectedUser', selectedUser);
    }

// Début gestion des Authors

    let authors = [];
    let selectedAuthor = null;

    async function loadAuthors() {
        try {
            const data = await getAllAuthors(token);
            console.log("Résultat API", data);
            authors = data;
        } catch (err) {
            console.error("Erreur fetch :", err);
            authors =[];
        }
    }

    async function handleDeleteAuthor(author_id){
        try {
            const result = await DeleteAuthor(author_id, token);
            await loadAuthors();
        } catch (error) {
            console.error("Erreur de delete :", error);
        }
    }

    // ouvrir le modal du create
    async function handleCreateAuthor() {
        selectedAuthor = null;
        modalMode = "create";
        await loadAuthors();
        showModal = true;
    }

    function handleUpdateAuthor(author) {
        selectedAuthor = author;
        modalMode = "update";
        showModal = true;
        console.log('selectedAuthor', selectedAuthor);
    }
// Fin de gestion des Authors

// Fin gestion des Users

// Début gestion des Books
    let books = [];
    let selectedBook = null;

    async function loadBooks() {
        try {
            const data = await getAllBooks(token);
            //console.log("Résultat API", data);
            books = data;
        } catch (err) {
            console.error("Erreur fetch :", err);
            books =[];
        }
    }

    async function handleDeleteBook(book_id){
        try {
            const result = await DeleteBook(book_id, token);
            await loadBooks();
            await loadAuthors();
        } catch (error) {
            console.error("Erreur de delete :", error);
        }
    }

    // ouvrir le modal du create
    async function handleCreateBook() {
        selectedBook = null;
        modalMode = "create";
        await loadAuthors();
        await loadCategories();
        showModal = true;
    }

    function handleUpdateBook(book) {
        selectedBook = book;
        modalMode = "update";
        showModal = true;
        //console.log('selectedBook', selectedBook);
    }
//Début gestoin des livres

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
    
    <section class="filter_container">
        {#if filter === "users"  }
            <!-- <button class="admin_button" on:click={handleCreateUser}>Ajouter un Utilisateurs</button> -->
            {#each users as user }
                <UserShow
                    user = {user}
                    onDelete = {handleDeleteUser}
                    onUpdate = {handleUpdateUser}
                    />                    
            {/each}
        {/if}

        {#if filter === "books"  }
            <button class="admin_button" on:click={handleCreateBook}>Ajouter un Livre</button>
            {#each books as book}
                <BookShow
                book = { book}
                onDelete = {handleDeleteBook}
                onUpdate = {handleUpdateBook}
                admin = {true}
                />
            {/each}
            
        {/if}

        {#if filter === "authors"  }
            <button class="admin_button" on:click={handleCreateAuthor}>Ajouter un Auteur</button>
            {#each authors as author}
                <AuthorShow
                author = { author}
                onDelete = {handleDeleteAuthor}
                onUpdate = {handleUpdateAuthor}
                admin = {true}
                />
            {/each}
        {/if}
        
        {#if filter === "categories"  }
            <button class="admin_button" on:click={handleCreateCategory}>Ajouter une Catégorie</button>
            <ul>
                {#each categories as category }
                    <CategoryShow
                    category = {category}
                    onDelete = {handleDeleteCategory}
                    onUpdate = {handleUpdateCategory}
                    />                    
                {/each}
            </ul>
        {/if}
    </section>

    {#if showModal}
        <div class="modal-backdrop" on:click={closeModal}></div>
        <div class="modal">
            {#if filter ==="categories"}
                <CategoryForm
                category={selectedCategory}
                mode={modalMode}
                token={token}
                onClose={closeModal}
                onSubmitted={async () => { //callback après PATCH réussi
                        await loadCategories();
                        closeModal();
                }}
                />
            {/if}            
            {#if filter ==="users"}
                <UserForm
                user={selectedUser}
                mode={modalMode}
                token={token}
                onClose={closeModal}
                onSubmitted={async () => { //callback après PATCH réussi
                        await loadUsers();
                        closeModal();
                }}
                />
            {/if}
            {#if filter ==="books"}
                <BookForm
                categories = {categories}
                authors = {authors}
                book={selectedBook}
                mode={modalMode}
                token={token}
                onClose={closeModal}
                onSubmitted={async () => { //callback après PATCH réussi
                    await loadBooks();
                    closeModal();
                }}
                />
            {/if}
            {#if filter ==="authors"}
                <AuthorForm
                author={selectedAuthor}
                mode={modalMode}
                token={token}
                onClose={closeModal}
                onSubmitted={async () => { //callback après PATCH réussi
                    await loadAuthors();
                    closeModal();
                }}
                />
            {/if}       
        </div>
    {/if}
</div>

<style>
    .admin_container{
        display: flex;
        flex-direction: column;
    }
    
    .active{
        text-decoration: underline;
        font-size: large;
    }
    
    .filter_container{
        display: flex;
        flex-direction: column;
    }
    
    .admin_button{
        width: 30%;
        align-self: center;
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