<script>
    import AddBookButton from "./AddBookButton.svelte";

    import StatusButton from "./StatusButton.svelte";
    import DeleteBookButton from "./DeleteBookButton.svelte";
    import { page } from "$app/stores";
    import { createEventDispatcher } from "svelte";
	import { preventDefault } from "svelte/legacy";
	import { goto } from "$app/navigation";
    

    export let onDelete;
    export let onUpdate;
    export let onAdd;
    // export passés a StatusButton
    export let book;
    export let user_id;
    export let token;

    export let admin;
    const dispatch = createEventDispatcher();

    let currentPath;
    // Réactivité automatique avec $:
    $: currentPath = $page.url.pathname

    // AJOUT SYLVAIN
    console.log(book)

    function handleClick(event){
        // On regarde le chemin que va parcourir l'evenement dans le DOM. S'il rencontre un bouton ou un select, alors il "return" sinon il va a la page du livre
        const path = event.composedPath ? event.composedPath() : (event.path || []);
        if (path.some(node => node && node.tagName && ['BUTTON','SELECT'].includes(node.tagName))) {
            return;
        }
        goto(`/book/${book.id}`);

        return;
    }

    console.log(book)

</script>

<article class="bookshow">
    <img src={`${import.meta.env.VITE_API_PUBLIC_URL}/images/${book.image_url}`} alt= {book.title}>
    <div class="book_infos">
        <h3 class="book_title" on:click={handleClick}>Titre : {book.title}</h3>
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
    <p class="book_summary"><strong>Résumé</strong> : { book.summary}
    </p>
    <div class="button_container">
    {#if book.userStatus !== 'absent' && (book.userStatus || book.Users?.[0]?.Status?.status) && !admin }
            <StatusButton 
                book ={book} user_id={user_id} token={token}
                on:statusChange={(event)=> dispatch("statusChange", event.detail)}
            />
        {/if}
        
        {#if book.Users?.[0]?.Status?.status !== 'lu' && book.Users?.[0]?.Status?.status !== 'en cours' && book.Users?.[0]?.Status?.status !== 'à lire' && currentPath !== '/'}
            <AddBookButton onAdd={() => {onAdd(book.id);}}/>
        {/if}
        {#if (currentPath.startsWith('/user/')) || admin || ['en cours', 'à lire', 'lu'].includes(book.Users?.[0]?.Status?.status)}
            <DeleteBookButton onDelete={() => {onDelete(book.id);}} />
        {/if}
        {#if currentPath.startsWith('/search') && (book.Users?.[0]?.Status?.status === 'en cours' && book.Users?.[0]?.Status?.status === 'à lire' && book.Users?.[0]?.Status?.status !== 'lu') }
             <DeleteBookButton onDelete={() => {onDelete(book.id);}} />
        {/if}
    </div>
</article>

<style>
    article{

        border-radius: var(--border-radius);
        background-color: var(--color-main);
        display: flex;
        height: 150px;
        width: auto;
        padding: 1rem;
        margin: 1rem;
        gap: 0.5rem;
        box-shadow: var(--shadow);
    }

    img{

        border-radius: var(--border-radius);
        max-height: 100%;
        object-fit: cover;
        box-shadow: var(--shadow);

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

.book_title:hover{
    text-decoration: underline;
    cursor: pointer;
}

    .book_summary{
        box-sizing: border-box;
        /* max-height: 100%; */
        min-width: 0;
        font-size: 0.9rem;
        border-radius: var(--border-radius);
        background-color: var(--color-secondary);
        flex: 2;
        padding: 0.5rem;
         overflow: hidden;
               /* coupe le texte qui dépasse */
        text-overflow: ellipsis;
        /* ajoute "..." si c’est trop long */
        strong {
            font-size: 1rem;
        }
    }

    /* Boutons */
    .button_container {
        display: flex;
        align-self: center;
        gap: 0.5rem;
    }

    .bookshow:hover{
        
        box-shadow: var(--shadow-hover);
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



