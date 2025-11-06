<script>

</script>

<div class="header_search">
    <input type="text" placeholder="Recherche..." />
        <div>
            <input id="author" type="radio" name="filter" />
            <label for="author">Auteur</label>
            <input id="title" type="radio" name="filter" />
            <label for="title">Titre</label>
        </div>
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