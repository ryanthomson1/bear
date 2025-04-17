'use server';
/**
 * @fileOverview A thread reply suggestion AI agent.
 *
 * - suggestThreadReplies - A function that handles the thread reply suggestion process.
 * - SuggestThreadRepliesInput - The input type for the suggestThreadReplies function.
 * - SuggestThreadRepliesOutput - The return type for the suggestThreadReplies function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestThreadRepliesInputSchema = z.object({
  postContent: z.string().describe('The content of the thread post to reply to.'),
});
export type SuggestThreadRepliesInput = z.infer<typeof SuggestThreadRepliesInputSchema>;

const SuggestThreadRepliesOutputSchema = z.object({
  replySuggestion: z.string().describe('The AI-generated reply suggestion for the thread post.'),
});
export type SuggestThreadRepliesOutput = z.infer<typeof SuggestThreadRepliesOutputSchema>;

export async function suggestThreadReplies(input: SuggestThreadRepliesInput): Promise<SuggestThreadRepliesOutput> {
  return suggestThreadRepliesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestThreadRepliesPrompt',
  input: {
    schema: z.object({
      postContent: z.string().describe('The content of the thread post to reply to.'),
    }),
  },
  output: {
    schema: z.object({
      replySuggestion: z.string().describe('The AI-generated reply suggestion for the thread post.'),
    }),
  },
  prompt: `You are an AI assistant designed to generate reply suggestions for Threads posts.

  Given the following Threads post, generate a reply suggestion that is engaging and relevant to the content of the post.

  Threads Post:
  {{postContent}}`,
});

const suggestThreadRepliesFlow = ai.defineFlow<
  typeof SuggestThreadRepliesInputSchema,
  typeof SuggestThreadRepliesOutputSchema
>(
  {
    name: 'suggestThreadRepliesFlow',
    inputSchema: SuggestThreadRepliesInputSchema,
    outputSchema: SuggestThreadRepliesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
