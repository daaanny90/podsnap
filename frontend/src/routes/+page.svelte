<script lang="ts">
	import type { Episode } from './../../types/Episode';
	import type { FirebaseEpisode } from './../../types/FirebaseEpisode';
	import type { FirebaseShow } from './../../types/FirebaseShow';
	import type { SearchHistoryItem } from './../../types/SearchHistoryItem';

	import { doc, setDoc } from 'firebase/firestore';
	import { db } from '../lib/utils/firestore';
	import { onMount } from 'svelte';
	import { generateDocId } from './../lib/utils/firestoreDocIdGenerator';

	let form: HTMLFormElement;
	let fromHistory: HTMLFormElement;
	let feedInput: HTMLInputElement;
	let loading = false;
	let episodes: Episode[] = [];
	let searchHistory: SearchHistoryItem[] = []

	const parseFeed = async (formElement: HTMLFormElement) => {
		const formData = new FormData(formElement);
		const episodeUrl = formData.get('feed-url');

		for (const pair of formData.entries()) {
			console.log(pair)
		}
		loading = true;

		fetch('http://localhost:8080/index', {
			method: 'POST',
			mode: 'cors',
			body: episodeUrl
		})
			.then((data) => data.json())
			.then((response) => {
				episodes = response;
				loading = false;
			});
	};

	const snapEpisode = async (episode: Episode) => {
		const showId = generateDocId(episode.show);
		const episodeId = `${showId}_${generateDocId(episode.title)}`;
		
		const episodeDocument: Partial<FirebaseEpisode> = {
			name: episode.title,
			show: `/shows/${showId}`,
			url: episode.url
		};

		const showDocument: Partial<FirebaseShow> = {
			episodes: [
				`/episodes/${episodeId}`
			]
		};

		await setDoc(doc(db, 'episodes', episodeId), episodeDocument, { merge: true })
		await setDoc(doc(db, 'shows', showId), showDocument, { merge: true });
	};

	const secondsToHms = (duration: string) => {
		const dur = Number(duration);
		var h = Math.floor(dur / 3600);
		var m = Math.floor((dur % 3600) / 60);
		var s = Math.floor((dur % 3600) % 60);

		var hDisplay = h > 0 ? h + (h == 1 ? ' hour, ' : ' hours, ') : '';
		var mDisplay = m > 0 ? m + (m == 1 ? ' minute, ' : ' minutes, ') : '';
		var sDisplay = s > 0 ? s + (s == 1 ? ' second' : ' seconds') : '';
		return hDisplay + mDisplay + sDisplay;
	};

	const searchHistoryItems = (): SearchHistoryItem[] | [] => {
		const searchHistory = localStorage.getItem('search_history');

		if (!searchHistory) {
			return [];
		}

		return JSON.parse(searchHistory);
	};

	const selectHistoryItem = (feedUrl: string) => {
		feedInput.value = feedUrl
		form.submit()
	}

	onMount(async () => {
		searchHistory = searchHistoryItems()
		console.log(searchHistory)
	});
</script>

<form bind:this={form} on:submit|preventDefault={() => parseFeed(form)}>
	<label for="genres">Snap the podcast show:</label>
	<input bind:this={feedInput} type="text" name="feed-url" placeholder="Paste here the RSS feed of the show" />
	<button type="submit">Snap it!</button>
</form>

{#if searchHistory.length > 0}
	<p>Your last searched show:</p>
	<form bind:this={fromHistory} on:submit|preventDefault={() => parseFeed(fromHistory)}>
		<select name="feed-url" id="feed-url">
			{#each searchHistory as searchItem}
				<option value={searchItem.feedUrl}>{searchItem.show}</option>
			{/each}
		</select>
		<button type="submit">Show episodes</button>
	</form>
{/if}

<p>
	Do not know where to get the RSS feed of the podcast show? <a href="/get-feed">Get it here.</a>
</p>

{#if loading}
	<p>Loading...</p>
{/if}

{#each episodes as episode}
	<div class="episodeCard">
		<img src={episode.cover} alt={episode.title} width="100" height="100" />
		<h2>{episode.title}</h2>
		<p>Duration: {secondsToHms(episode.duration)}</p>
		<button
			on:click={() => {
				snapEpisode(episode);
			}}>Snap this episode!</button
		>
	</div>
{/each}
