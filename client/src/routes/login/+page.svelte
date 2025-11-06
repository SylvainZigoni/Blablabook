<script>
    import Login from "$lib/components/ui/Login.svelte";
    import { goto } from "$app/navigation";
    // export let data; // Permet de récupérer les données fetchées coté serveur
    export let form;

     $: if (form?.success){
         setTimeout(()=> goto(`/user/${form.success.id}`), 2000)
        }
</script>

<Login {form} />

{#if form?.success}
    <p> Bienvenue {form.success.username}</p>
{/if}

{#if form?.error}
    <p> Rien a afficher</p>
{/if}

<style>

</style>