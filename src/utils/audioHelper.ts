/**
 * Helper to speak Arabic prayer or Indonesian translation
 * using Web Speech API with high elderly-friendly clarity.
 */

let synth: SpeechSynthesis | null = null;
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  synth = window.speechSynthesis;
}

export function playTextSpeech(
  text: string,
  lang: 'ar-SA' | 'id-ID' = 'id-ID',
  rate = 0.85,
  onEnd?: () => void
): boolean {
  if (!synth) {
    return false;
  }

  // Cancel any ongoing speech
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate; // slightly slower for elderly clarity
  utterance.pitch = 1.0;

  // Try to find matching voice
  const voices = synth.getVoices();
  const matchedVoice = voices.find(v => v.lang.startsWith(lang.slice(0, 2)));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  synth.speak(utterance);
  return true;
}

export function stopTextSpeech(): void {
  if (synth) {
    synth.cancel();
  }
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}
