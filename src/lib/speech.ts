export type SpeechToTextResult = {
  transcript: string;
  confidence?: number;
};

export async function speechToTextOnce(): Promise<SpeechToTextResult> {
  const SpeechRecognitionCtor =
    (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;

  if (!SpeechRecognitionCtor) {
    throw new Error('SpeechRecognition is not supported in this browser');
  }

  return await new Promise<SpeechToTextResult>((resolve, reject) => {
    const rec = new SpeechRecognitionCtor();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-US';

    rec.onresult = (event: any) => {
      const result = event?.results?.[0]?.[0];
      resolve({ transcript: String(result?.transcript ?? ''), confidence: result?.confidence });
    };
    rec.onerror = (e: any) => {
      console.error('Speech recognition error:', e.error);
      reject(new Error(`Speech recognition failed: ${e.error}`));
    };
    rec.onend = () => {
      // If no result fired, we still resolve empty.
      // Callers can treat empty transcript as cancellation.
    };

    rec.start();
  });
}

