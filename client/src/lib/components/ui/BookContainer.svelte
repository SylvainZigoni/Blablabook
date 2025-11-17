<script>
	import AddBookButton from "$lib/components/ui/AddBookButton.svelte";
	import DeleteBookButton from "$lib/components/ui/DeleteBookButton.svelte";
	import StatusButton from "$lib/components/ui/StatusButton.svelte";
    import {page} from "$app/stores"
    export let book;
    export let user_id;
    export let token;
    export let onDelete;
    import Icon from "@iconify/svelte";


console.log("Book depuis la page de livre",book)


// TODO: Utiliser user_id pour les routes + delete et modif statut


let statutBook= book?.Users?.[0]?.Status?.status ?? "";
$ : statutBook = book?.Users?.[0]?.Status?.status ?? "";

console.log(statutBook)
console.log(book);


// pour delete le livre via clique sur le bouton
    async function deleteBook (book_id) {
        const response = await fetch(`${import.meta.env.VITE_API_PUBLIC_URL}/books/${user_id}/${book.id}`,
        {
            method : 'DELETE',
            headers :{
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            } 
        });

        const result = await response.json();

        if(response.ok) {
            book.Users[0].Status.status = "absent"
        }
    }




</script>

<article class="book-container">
    <h2 class="book-container--title"><Icon icon="raphael:book" width="32" height="32" /> {book.title}</h2>
    <div class="book-container--elements">
        <div class="book-container--elements-imgBtn">
            <img src={`${import.meta.env.VITE_API_PUBLIC_URL}/images/${book.image_url}`} alt={book.title}>
            <div class="book-container--elements-btn">
                {#if statutBook !== "absent"}
                    <div class="StatusButton">
                        <StatusButton {book} {user_id} {token}/>
                    </div>
                {/if}
                <div class="interactButton">
                    {#if statutBook !== "absent"}
                        <DeleteBookButton onDelete={deleteBook}/>
                    {/if}
                    {#if statutBook === "absent"}
                        <AddBookButton {book} />
                    {/if}
                </div>
            </div>
        </div>
        <div class="book-container--elements-info">
            <ul>
            <li><Icon icon="material-symbols:person" width="16" height="16" /> <strong>Auteur
                {#if book.Authors.length>1}s{/if} :</strong>
                {#each book.Authors as author}
                    {author.forname} {author.name}
                {/each}
            </li>
            <li><Icon icon="streamline-flex:search-category-remix" width="16" height="16" /> <strong>Genre
                <!-- {#if book.Categories.length>1}s {/if} -->
                  :</strong>
                {#each book.Categories as category, i }
                    {category.name}{i < book.Categories.length - 1 ? ', ': ''}
                {/each}
            </li>
            <li><Icon icon="material-symbols:date-range" width="16" height="16" /> <strong>Date de parution :</strong>
                {book.date_parution}
            </li>
            </ul>
            <article class="summary-container">
                <strong>Résumé :</strong><br>
                <p class="summary-container--text"> 
                    {book.summary}  Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Quos, nulla alias ipsum, aperiam id, 
        quibusdam maxime nihil similique repellat nam nemo sequi eum. 
        Suscipit molestiae sit blanditiis aliquam ea? Consectetur! 
        Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Quo natus maxime magni obcaecati alias blanditiis error officiis iure asperiores quod voluptatum autem, 
        similique impedit eum ipsum dolorem assumenda exercitationem! Assumenda.
                </p>
             </article>
        </div>
    </div>
</article>

<style>
.book-container{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
}

.book-container--title{
    display: flex;
}

.book-container--elements{
        /* border: 1px red solid; */
}

.book-container--elements-imgBtn{
    margin: auto;
    margin-top: 10px;
    background-color: var(--color-secondary);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    padding: 10px;
}

.book-container--elements-btn{
        /* border: 1px red solid; */
        margin-top: 10px;
        display: flex;
        justify-content: space-around;
}

.StatusButton {
    margin-top: 10px;
    width: 80%;
}

.book-container--elements-info{
    margin-top: 20px;
    border-top: 1px var(--color-header-footer) solid;
    padding-top: 10px;
}

.interactButton{
    align-self: flex-end;
}

img {
    display: block;
    max-width: 100%;
    margin: auto;
}

.summary-container {
    margin-top: 10px;
    border-top: 1px var(--color-header-footer) solid;
    padding-top: 10px;
    strong {
        font-size: 1.2rem;
    }
}

.summary-container--text {
    margin-top: 10px;
}


@media (min-width: 650px) {
    .book-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
    }

    .book-container--elements-imgBtn {
        margin-left: 0;
        width: 45%;
    }

    .book-container--elements-info{
        width: 50%;
    }

    .book-container--elements{
        margin-left: 0;
        display: flex;
        max-height: 70vh;
        gap : 24px;
        align-items: stretch;


        flex-direction: row;
    }
}
</style>