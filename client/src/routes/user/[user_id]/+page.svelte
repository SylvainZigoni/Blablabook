<script>
    import User from "$lib/components/ui/User.svelte";

    export let data;
</script>

<User 
userBooks={data.userBooks}
status={data.status}
user_id={data.user_id}
token={data.token}
/>
