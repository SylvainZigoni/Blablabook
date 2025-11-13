<script>
    import StatusButton from "./StatusButton.svelte";
    import DeleteBookButton from "./DeleteBookButton.svelte";
    import AddBookButton from "./AddBookButton.svelte";
    import { page } from "$app/stores";
    import { createEventDispatcher } from "svelte";

    export let onDelete;
    export let onAdd;
    // export passés a StatusButton
    export let book;
    export let user_id;
    export let token;

    const dispatch = createEventDispatcher();

    let currentPath;
    // Réactivité automatique avec $:
    $: currentPath = $page.url.pathname

    // AJOUT SYLVAIN
    console.log(book)
    console.log(book.userStatus)


</script>

<article>
    <img src={`${import.meta.env.VITE_API_PUBLIC_URL}/images/${book.image_url}`} alt= {book.title}>
    <div class="book_infos">
        <h3>Titre : {book.title}</h3>
        {#if book.Authors && book.Authors.length > 0}
            <p><strong>Auteur{book.Authors.length > 1 ? 's' : ''}</strong>:
                <!-- {#each tableau as element, index} -->
                {#each book.Authors as author, i}
                    {author.forname} {author.name}{i < book.Authors.length - 1 ? ', ' : ''}
                {/each}
            </p>
        {:else}
            <p><strong>Auteur</strong>: Inconnu</p>
        {/if}
        <p class="book_date"><strong>Date de publication </strong>: {book.date_parution}</p> 
        {#if book.Categories && book.Categories.length > 0}
            <p class="book_category"><strong>Genres</strong>: 
                {#each book.Categories as category, i}
                    {category.name}{i < book.Categories.length - 1 ? ', ' : ''}
                {/each}
            </p>
        {:else}
            <p class="book_category"><strong>Genres</strong>: Aucun</p>
        {/if}       
    </div>
    <p class="book_summary"><strong>Résumé</strong> : { book.summary} Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Quos, nulla alias ipsum, aperiam id, 
        quibusdam maxime nihil similique repellat nam nemo sequi eum. 
        Suscipit molestiae sit blanditiis aliquam ea? Consectetur! 
        Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Quo natus maxime magni obcaecati alias blanditiis error officiis iure asperiores quod voluptatum autem, 
        similique impedit eum ipsum dolorem assumenda exercitationem! Assumenda.
    </p>
    <div class="button_container">
        {#if currentPath !== '/'}
            <StatusButton 
                book ={book} user_id={user_id} token={token}
                on:statusChange={(event)=> dispatch("statusChange", event.detail)}
            />
        {/if}
        {#if book.userStatus === 'absent'}
            <AddBookButton onAdd={() => {onAdd(book.id);}}/>
        {/if}
        {#if currentPath.startsWith('/user/') || book.userStatus !== 'absent'}
            <DeleteBookButton onDelete={() => {onDelete(book.id);}} />
        {/if}
    </div>    
</article>

<style>
    article{
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        background-color: var(--color-main);
        display: flex;
        height: 150px;
        width: auto;
        padding: 1rem;
        margin: 1rem;
        gap: 0.5rem;
    }

    img{
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        max-height: 100%;
        object-fit: cover;

    }

    .book_infos{   
        max-height: 100%;
        min-width: 0;
        overflow: hidden;
        flex: 1;
        padding: 0.5rem;
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: space-around;
        overflow: hidden;       /* coupe le texte qui dépasse */
        text-overflow: ellipsis; /* ajoute "..." si c’est trop long */
    }

    .book_summary{
        max-height: 100%;
        min-width: 0;
        border: 1px solid var(--border-color);   
        border-radius: var(--border-radius);
        background-color: var(--color-secondary);
        border: 1px solid black;
        flex: 2;
        padding: 0.5rem;
        overflow: hidden;       /* coupe le texte qui dépasse */
        text-overflow: ellipsis; /* ajoute "..." si c’est trop long */    
    }

    /* Boutons */
    .button_container {
        display: flex;
        align-self: center;
        gap: 0.5rem;
    }

    @media (max-width: 1240px) {
    
        .book_date {
            display: none;
        }

        .book_category {
            display: none;
        }
    }

    @media (max-width: 875px) {
        article{
            flex-direction: column;
            align-items: center;
            height: auto;
        }
        
        img{
            width: 50%;
            max-height: 200px;
            object-fit: contain;
            border: none;
            border-radius: var(--border-radius);

        }

        .button_container{
            width: 30%;
            display: flex;
            flex-direction: column;
            text-align: center;
        }
    }

    @media (max-width: 475px) {
        article{
            flex-direction: column;
            height: 80%;
        }
        .button_container{
            display: flex;
            flex-direction: column;
        }

        .book_summary {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 5;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: normal;
        }
    }
</style>



