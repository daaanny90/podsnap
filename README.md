# PodSnap

 This project is a platform that allows users to easily search for their favorite podcast shows and listen to a concise 5-minute version of any episode, both in audio and written form, with just one click.

## Technical Documentation

### Architecture
Podsnap uses a serverless backend architecture served by Google Cloud Functions and Firebase for data storage. The frontend is built using Svelte with SvelteKit.

The platform allows users to:

1. Search for a podcast show and enter its RSS feed URL.
2. Select an episode and click "snap this episode."
3. Add the episode and show data to Firebase collections with basic initial data.

The following functions are used to process the episode:

1. Function 1 reads the new URL of the original mp3 file of the episode and saves the mp3 file in the bucket.
2. Function 2 sends the mp3 to the speech-to-text API, getting the text of the episode, and saves it in the episode document.
3. Function 3 sends the new text to the Cloud natural language API, requesting a max 750 words summary of the text, and saves this short text in the episode document.
4. Function 4 sends the new short text to the speech-to-text API, getting an audio version of the short text and saving it in the bucket (and the bucket location in the episode document).
5. Function 5 sends the response to the client with the short text and playable mp3 of the short text.

To run your own PodSnap, you need:

1. A GCP account and a project initialized with Firebase and Bucket.
2. To enable a service worker.
3. To provide credentials to your Firebase.

More information is available in the documentation.

### Getting started
When the GCP Project is running with Firebase, generate your service worker and save the `json` file under `/credentials`.

Then save the path `./credentials/<your_service_worker>.json` in the `.env` file.

Copy also the Firebase credentials and paste it in a file with name `firebase_credentials.json` under `/credentials`.

After that you should run two terminals. One in the root folder giving `npm run start` and the second one in the `/frontend` folder with `npm run dev`.
