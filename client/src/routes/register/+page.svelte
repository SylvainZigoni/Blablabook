<script>
    import Register from '$lib/components/ui/Register.svelte';
    import { goto } from '$app/navigation';
    export let form;

    // Rend la donnée dynamique grace à $ et execute le code a son succès
    $: if (form?.success){
        setTimeout(() => goto('/login'), 3000); // redirige après 3 secondes
    }
</script>

<Register {form} />

<style>

</style>