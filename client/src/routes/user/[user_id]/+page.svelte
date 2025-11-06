<script>
    import User from "$lib/components/ui/User.svelte";
    export let data
</script>


<User books={data.books}/>
<!-- <User userBooks ={data.userBooks}/> -->


<style>

</style>