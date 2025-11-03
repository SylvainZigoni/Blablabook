<script>
	import favicon from '$lib/assets/favicon.svg';
    import Header from '$lib/components/layout/Header.svelte';
	import '../styles/reset.css';
	import '../styles/app.css';
    import Footer from '$lib/components/layout/Footer.svelte';

</script>

<svelte:head>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
</svelte:head>


<div class="layout">
	<Header/>
	<main>	
		<slot/>
	</main>
	<Footer/>
</div>


<style>


html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden; /* empêche le scroll global */
}

.layout {
  height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto; /* header, slot, footer */
}

header {
  position: sticky;
  top: 0;
  z-index: 10;
}

main {
  overflow-y: auto;
  padding: 1rem;
}

footer {
  position: sticky;
  bottom: 0;
  z-index: 10;
}

</style>
