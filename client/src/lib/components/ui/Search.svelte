<script>

    let query = '';
    let searchBy = 'title';
    let results = [];
    let error = '';

    async function handleSearch() {

        const params = new URLSearchParams({
            q: query,
            by: searchBy
        });


        error = '';

        try {
            const response = await fetch(`/api/search?${params.toString()}`);
            if (!response.ok) throw new Error (await response.text() || response.statusText);
            results = await response.json();
            console.log(results)

            const url = new URL(window.location.href);
            url.search = params.toString();

        } catch (error) {
            error = error.message;
            results = [];

        }
    }
</script>


<div class="header_search">
    <form on:submit|preventDefault={handleSearch}>
        <input type="text" placeholder="Recherche..." name="content" bind:value={query}/>
            <div>
                <input id="author" type="radio" name="filter" value="author" bind:group={searchBy}/>
                <label for="author">Auteur</label>
                <input id="title" type="radio" name="filter" value="title" defaultChecked bind:group={searchBy}/>
                <label for="title">Titre</label>
            </div>
        <button type="submit" >Rechercher</button>
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
	border-radius: 4px;
	color: #000;
	box-sizing: border-box;
}
</style>