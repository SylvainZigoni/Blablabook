<script>
    import Register from '$lib/components/ui/Register.svelte';
     import { goto } from '$app/navigation';
    export let form;

    $: if (form?.success){
        setTimeout(() => goto('/login'), 3000); // redirige après 2 secondes
    }
</script>

<Register {form} />

<style>

</style>