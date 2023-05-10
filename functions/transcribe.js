
import { SpeechClient } from '@google-cloud/speech';
import fetch from 'node-fetch'

const client = new SpeechClient({ keyFilename: import.meta.env.VITE_SERVICE_WORKER });

export const transcribeAudioFile = async (audioUrl) => {
  console.log('start transcription process.')
  try {
    console.log('Fetch the audio file')
    const audioResponse = await fetch(audioUrl);
    const audioBuffer = await audioResponse.buffer();

    console.log('Configure the audio request')
    const audio = {
      content: audioBuffer.toString('base64')
    };
    const config = {
      encoding: 'MP3',
      sampleRateHertz: 44100,
      languageCode: 'en-US'
    };
    const request = {
      audio: audio,
      config: config
    };

    console.log('Transcribe the audio file')
    const [response] = await client.recognize(request);

    console.log('Extract the transcription from the response')
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    console.log('Return the transcription')
    return transcription;
  } catch (error) {
    console.error(error);
    return '';
  }
}
