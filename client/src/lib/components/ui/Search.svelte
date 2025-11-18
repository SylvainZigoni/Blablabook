<script>
    import { goto } from "$app/navigation";
    import Icon  from '@iconify/svelte';

    let query = '';
    let searchBy = 'title';
    let results = [];
    let error = '';

    async function handleSearch() {

        const params = new URLSearchParams({
            q: query,
            by: searchBy
        });



        await goto(`/search?${params.toString()}`)
    }
</script>


<div class="header_search">
    <!-- On ajoute la notion de preventDefault directement dans le form -->
    <form class="search_form" on:submit|preventDefault={handleSearch}>
        <div class="search_form-text">
            <input class ="search_form-text--text_aera" type="text" placeholder="Recherche..." name="content" bind:value={query}/>
            <button aria-label="Rechercher" class="search_form-button" type="submit" ><Icon icon="lucide:search" width="20" height="20" /></button>
        </div>
        <div class="search_form-radio">
            <div class="search_form-radio--choice">
                <input id="author" type="radio" name="filter" value="author" bind:group={searchBy}/>
                <label for="author">Auteur</label>
            </div>
            <div class="search_form-radio--choice">
                <input id="title" type="radio" name="filter" value="title" defaultChecked bind:group={searchBy}/>
                <label for="title">Titre</label>
            </div>
                
        </div>
    </form>
</div>

<style>
input[type="radio"] {
	appearance: auto; /* Restaure l’apparence native */
	-webkit-appearance: radio;
	-moz-appearance: radio;
	width: 16px;
	height: 16px;
	margin-right: 0.5rem;
	cursor: pointer;
}

input[type="text"] {
	appearance: auto;
	-webkit-appearance: textfield;
	-moz-appearance: textfield;
	
	/* Restaure un minimum de styles de base */
	background-color: white;
	border: 1px solid #ccc;
	padding: 0.5rem;
	border-radius: var(--border-radius);
	color: #000;
	box-sizing: border-box;
    height: 40px;
}

.search_form {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap : 10px
}

.search_form-text{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap : 10px
}

.search_form-text--text_aera{
    width: 100%;
    box-shadow: var(--shadow);
}

.search_form-button{
    padding: 2px;
    height: 40px;
    width: 40px;
}

.search_form-button:hover {
    background-color: var(--color-main);
    color : var(--color-text-main);
    scale: 1.03;
}

.search_form-radio{
    display: flex;
    
}


.search_form-radio--choice {
    margin: 0 20px 0 0;
}
</style>