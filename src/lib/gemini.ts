export type GeminiGenerateOptions = {
  apiKey?: string;
  model?: string;
};

/**
 * Minimal placeholder to match the reference structure.
 * Wire up a real Gemini client when you add a backend or secure proxy.
 */
export async function geminiGenerateText(_prompt: string, _opts: GeminiGenerateOptions = {}) {
  throw new Error('geminiGenerateText is not configured (missing backend/proxy)');
}

