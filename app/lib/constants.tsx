// Represents a sound model with its name and URL
export interface hfModel {
  name: string; // The name of the hf model
  url: string; // The URL to the model for generating hf
}

// An array of predefined hf models
const HF_MODELS: hfModel[] = [
  {
    name: "Meta-Llama-3",
    url: "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B",
  },
  {
    name: "bart-large-cnn",
    url: "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
  },
  {
    name: "Speechbrain - Ljspeech",
    url: "https://api-inference.huggingface.co/models/speechbrain/tts-tacotron2-ljspeech",
  },
  {
    name: "Voicemod - Fastspeech2",
    url: "https://api-inference.huggingface.co/models/Voicemod/fastspeech2-en-male1",
  },
];

export default HF_MODELS;
