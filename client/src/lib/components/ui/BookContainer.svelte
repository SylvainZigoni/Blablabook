<script>
	import AddBookButton from "$lib/components/ui/AddBookButton.svelte";
	import DeleteBookButton from "$lib/components/ui/DeleteBookButton.svelte";
	import StatusButton from "$lib/components/ui/StatusButton.svelte";
    import {page} from "$app/stores"
    export let book;
    import Icon from "@iconify/svelte";
console.log("Book depuis la page de livre",book)

let statutBook= book?.Users?.[0]?.Status?.status ?? "";
$ : statutBook = book?.Users?.[0]?.Status?.status ?? "";

console.log(statutBook)


</script>

<article class="book-container--title">
    <h2 class="book-container--title-h2"><Icon icon="raphael:book" width="32" height="32" /> {book.title}</h2>
    <div class="book-container--elements">
        <div class="book-container--elements-imgBtn">
            <img src={`${import.meta.env.VITE_API_PUBLIC_URL}/images/${book.image_url}`} alt={book.title}>
            <div class="book-container--elements-btn">
                <StatusButton {book}/>
                {#if statutBook !== ""}
                    <DeleteBookButton {book}/>
                {/if}
                {#if statutBook === ""}
                    <AddBookButton {book} />
                {/if}
            </div>
        </div>
        <div class="book-container--elements-info">
            <p>Auteur
                {#if book.Authors.length>1}s{/if} :
                {#each book.Authors as author}
                    {author.forname} {author.name}
                {/each}
            </p>
            <p>Genre
                {#if book.Categories.length>1}s{/if} :
                {#each book.Categories as category, i }
                    {category.name}{i < book.Categories.length - 1 ? ', ': ''}
                {/each}
            </p>
            <p>Date de parution :
                {book.date_parution}
            </p>
             <p>Résumé :
                {book.summary}
             </p>
        </div>
    </div>
</article>

<style>
.book-container--title{
    display: flexbox;
    align-items: center;
    margin: auto;
    border: 1px red solid;
}

.book-container--title-h2{
    display: flex;
}

.book-container--elements{
        border: 1px red solid;
}

.book-container--elements-imgBtn{
    border: 1px red solid;
}

.book-container--elements-btn{
        border: 1px red solid;
}

.book-container--elements-info{
    border: 1px red solid;
}
</style>