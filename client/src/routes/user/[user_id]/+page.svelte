<script>
    import User from "$lib/components/ui/User.svelte";
    export let data
</script>

<!-- <p>Statut reçu : {data.statut}</p> -->
<User userBooks={data.userBooks} status={data.status}/>

<style>

</style>