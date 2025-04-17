// src/ai/flows/generate-thread-posts.ts
'use server';

/**
 * @fileOverview Generates multiple distinct Thread posts based on a user-provided idea, text, or URL.
 *
 * - generateThreadPosts - A function that generates multiple Thread posts.
 * - GenerateThreadPostsInput - The input type for the generateThreadPosts function.
 * - GenerateThreadPostsOutput - The return type for the generateThreadPosts function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateThreadPostsInputSchema = z.object({
  input: z
    .string()
    .describe('The idea, text, or URL to generate Thread posts from.')
    .optional(),
  systemInstructions: z
    .string()
    .describe('System instructions for generating the posts')
    .optional(),
});
export type GenerateThreadPostsInput = z.infer<typeof GenerateThreadPostsInputSchema>;

const GenerateThreadPostsOutputSchema = z.object({
  posts: z.array(
    z.object({
      content: z.string().describe('The generated Thread post content.'),
    })
  ),
});
export type GenerateThreadPostsOutput = z.infer<typeof GenerateThreadPostsOutputSchema>;

export async function generateThreadPosts(
  input: GenerateThreadPostsInput
): Promise<GenerateThreadPostsOutput> {
  return generateThreadPostsFlow(input);
}

const generateThreadPostsPrompt = ai.definePrompt({
  name: 'generateThreadPostsPrompt',
  input: {
    schema: z.object({
      input: z
        .string()
        .describe('The idea, text, or URL to generate Thread posts from.')
        .optional(),
      systemInstructions: z
        .string()
        .describe('System instructions for generating the posts')
        .optional(),
    }),
  },
  output: {
    schema: z.object({
      posts: z.array(
        z.object({
          content: z.string().describe('The generated Thread post content.'),
        })
      ),
    }),
  },
  prompt: `You are an expert social media content creator.

  Generate five distinct Thread posts based on the following input:

  {{#if systemInstructions}}
  System Instructions:
  {{systemInstructions}}
  {{/if}}

  {{#if input}}
  Input: {{input}}
  {{else}}
  Input: Generate according to the system instructions, if present. Otherwise, generate something creative.
  {{/if}}
  `,
});

const generateThreadPostsFlow = ai.defineFlow<
  typeof GenerateThreadPostsInputSchema,
  typeof GenerateThreadPostsOutputSchema
>(
  {
    name: 'generateThreadPostsFlow',
    inputSchema: GenerateThreadPostsInputSchema,
    outputSchema: GenerateThreadPostsOutputSchema,
  },
  async input => {
    const {output} = await generateThreadPostsPrompt(input);
    return output!;
  }
);
