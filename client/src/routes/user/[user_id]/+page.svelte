<script>
    import User from "$lib/components/ui/User.svelte";
    export let data
    export let status;
    export let user_id;
    export let token;
</script>

<!-- <p>Statut reçu : {data.statut}</p> -->
<User 
userBooks={data.userBooks}
status={data.status}
user_id={data.user_id}
token={data.token}
/>
