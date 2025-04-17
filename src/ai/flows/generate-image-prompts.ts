'use server';
/**
 * @fileOverview Flow for generating image prompts based on thread posts.
 *
 * - generateImagePrompts - A function that handles the image prompt generation process.
 * - GenerateImagePromptsInput - The input type for the generateImagePrompts function.
 * - GenerateImagePromptsOutput - The return type for the generateImagePrompts function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateImagePromptsInputSchema = z.object({
  threadPost: z.string().describe('The content of the thread post.'),
});
export type GenerateImagePromptsInput = z.infer<typeof GenerateImagePromptsInputSchema>;

const GenerateImagePromptsOutputSchema = z.object({
  imagePrompt: z.string().describe('The generated image prompt.'),
});
export type GenerateImagePromptsOutput = z.infer<typeof GenerateImagePromptsOutputSchema>;

export async function generateImagePrompts(input: GenerateImagePromptsInput): Promise<GenerateImagePromptsOutput> {
  return generateImagePromptsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateImagePromptsPrompt',
  input: {
    schema: z.object({
      threadPost: z.string().describe('The content of the thread post.'),
    }),
  },
  output: {
    schema: z.object({
      imagePrompt: z.string().describe('The generated image prompt.'),
    }),
  },
  prompt: `You are an AI expert in generating image prompts for Leonardo AI.

  Based on the following thread post, generate a suitable image prompt that will produce a visually appealing image to accompany the post.

  Thread Post: {{{threadPost}}}

  Image Prompt: `,
});

const generateImagePromptsFlow = ai.defineFlow<
  typeof GenerateImagePromptsInputSchema,
  typeof GenerateImagePromptsOutputSchema
>({
  name: 'generateImagePromptsFlow',
  inputSchema: GenerateImagePromptsInputSchema,
  outputSchema: GenerateImagePromptsOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});
