<script lang="ts">
	import ShowCard from '$lib/components/showCard.svelte';
  import type { SearchHistoryItem } from './../../../types/SearchHistoryItem'

	type ShowData = {
		collectionName: string;
		artworkUrl100: string;
		feedUrl: string;
	};

	let form: HTMLFormElement;
	let feedOutput: HTMLElement;

	let shows: ShowData[] = [];
	const media = 'podcast';
	const limit = 10;
	let loading = false;

	const searchFeed = () => {
		loading = true;
		const formData = new FormData(form);
		const showName = formData.get('search-feed');
		console.log(showName);

		fetch(`https://itunes.apple.com/search?term=${showName}&media=${media}&limit=${limit}`)
			.then((response) => response.json())
			.then((data) => {
				loading = false;
				console.log(data.results);
				shows = data.results;
			});
	};

	const copyRSSUrlAndSaveSearch = (show: ShowData) => {
    saveSearch(show)
		window.prompt('Feed RSS URL:', show.feedUrl);
	};

	const saveSearch = (show: ShowData) => {
		let searchHistory: string | null | SearchHistoryItem[] = localStorage.getItem('search_history');
		const searchHistoryItem = {
			show: show.collectionName,
			feedUrl: show.feedUrl
		};

		if (!searchHistory) {
			localStorage.setItem('search_history', '[]');
			searchHistory = [];
			searchHistory.push(searchHistoryItem);
			localStorage.setItem('search_history', JSON.stringify(searchHistory));
			return;
		}

		searchHistory = JSON.parse(searchHistory).push(searchHistoryItem);
		localStorage.setItem('search_history', JSON.stringify(searchHistory));
	};
</script>

<form bind:this={form} on:submit|preventDefault={searchFeed}>
	<label for="search-feed">Search feed for:</label>
	<input type="text" placeholder="Write here the show name" name="search-feed" />
	<button type="submit">Search</button>
</form>

{#if loading}
	<p>Loading...</p>
{/if}

{#each shows as show}
	<ShowCard title={show.collectionName} cover={show.artworkUrl100} />
	<button
		on:click={() => {
			copyRSSUrlAndSaveSearch(show);
		}}>Copy RSS feed URL</button
	>
{/each}
