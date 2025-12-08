/**
 * AI Provider Manager
 * Mengelola multiple AI providers (Groq, Qwen, dll)
 */

import Groq from 'groq-sdk';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export type AIProvider = 'groq';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AICompletionOptions {
  messages: AIMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
  provider?: AIProvider;
}

export interface AICompletionResponse {
  content: string;
  model: string;
  provider: string;
}

/**
 * Get completion from Groq AI
 */
async function getGroqCompletion(
  options: AICompletionOptions
): Promise<AICompletionResponse> {
  const completion = await groq.chat.completions.create({
    messages: options.messages as any,
    model: options.model || 'llama-3.3-70b-versatile',
    temperature: options.temperature || 0.8,
    max_tokens: options.max_tokens || 2048,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error('Failed to generate response from Groq');
  }

  return {
    content,
    model: completion.model,
    provider: 'Groq AI',
  };
}

/**
 * Get AI completion from the specified provider
 */
export async function getAICompletion(
  options: AICompletionOptions
): Promise<AICompletionResponse> {
  // Always use Groq
  return getGroqCompletion(options);
}

/**
 * Get default model for a provider
 */
export function getDefaultModel(provider: AIProvider): string {
  return 'llama-3.3-70b-versatile';
}

/**
 * Check if a provider is available (has API key configured)
 */
export function isProviderAvailable(provider: AIProvider): boolean {
  return !!process.env.GROQ_API_KEY;
}
