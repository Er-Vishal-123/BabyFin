
export const createSpeechUtterance = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.8; // Slower speech for better understanding
  utterance.pitch = 1.1; // Slightly higher pitch for friendliness
  utterance.volume = 0.9;
  return utterance;
};

export const stopSpeech = () => {
  window.speechSynthesis.cancel();
};
