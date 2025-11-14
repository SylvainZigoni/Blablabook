<script>
    //fonction Svelte qui permet au composant d'émettre des événements personnalisés que les composants parents peuvent écouter
    import { createEventDispatcher } from "svelte";

    export let book;
    export let user_id;
    export let token;

    const dispatch = createEventDispatcher();

    // Réactif si book change
    $: currentStatus = book.Users?.[0]?.Status?.status ?? "";

    async function handleChangeStatus(event) {
        const newStatus = event.target.value;
        console.log('newStatus', newStatus);

        console.log("token", token);
        console.log("user_id", user_id);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_PUBLIC_URL}/books/${user_id}/${book.id}`, {
                method : "PATCH",
                headers : {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({status : newStatus}),
            });
            
            if(response.ok){
                //dispatch("nom de l'evenement", {payload})
                // {bookId: book_id, newStatus} données passées par l'evenement e.details dans le parent
                // e.details = {bookId: book_id, newStatus}
                dispatch("statusChange", {book_id: book.id, newStatus})
            }
        } catch (error) {
            console.error(error);
        }
    };
</script>

<div class="status_container">
    <label for="status">Modifier le statut de lecture</label>
    <select name="status" id="status" on:change={handleChangeStatus} bind:value={ currentStatus } >
        <option value="en cours">Lecture en cours</option>
        <option value="à lire">Livres à lire</option>
        <option value="lu">Livre lu</option>
    </select>
</div>

<style>
    .status_container{
        display: flex;
        flex-direction: column;
        align-self: center;
        gap: 0.5rem;
    }
    
    select{
        border: 1px solid transparent;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        background-color:#354F52;
        color: var(--color-text-secondary);
        padding: 0.5rem;
    }
    
    option{
        background-color:#354F52;
        color: var(--color-text-secondary);
    }
</style>


