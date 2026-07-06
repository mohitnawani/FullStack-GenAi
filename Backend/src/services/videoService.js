const { AssemblyAI } = require("assemblyai");

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY,
});

const extractTextFromVideo = async (videoUrl) => {
  try {
    console.log("Starting transcription for:", videoUrl);

    // send URL directly — AssemblyAI handles everything
    const transcript = await client.transcripts.transcribe({
      audio_url: videoUrl,
    });

    console.log("Transcription complete!", transcript.text);

    return {
      text: transcript.text,
      duration: transcript.audio_duration, // in seconds
    };
  } catch (error) {
    throw new Error(`Video transcription failed: ${error.message}`);
  }
};

module.exports = extractTextFromVideo;
