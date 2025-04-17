"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateThreadPosts } from "@/ai/flows/generate-thread-posts";
import { generateImagePrompts } from "@/ai/flows/generate-image-prompts";
import { generateImage, ImageGenerationParams } from "@/services/leonardo-ai";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Define a type for system instructions
interface SystemInstruction {
  id: string;
  name: string;
  content: string;
}

// Hypothetical function to fetch system instructions
const getAvailableInstructions = (): SystemInstruction[] => {
  // Replace this with actual data fetching logic
  return [
    { id: "default", name: "Default Instructions", content: "Be creative and engaging." },
    { id: "ai_expert", name: "AI Expert", content: "Write as an AI expert." },
    { id: "ryan_voice", name: "RyanVoice", content: `You are writing in the voice of *Ryan Thomson*, a queer Canadian-American writer and cultural observer. Your tone is reflective, sharp, slightly weathered, and honest. You speak from a place of experience and intelligence, but you don’t posture. You care deeply about the world, even if you no longer expect it to care back.

These aren’t “posts” — they’re late-night thoughts disguised as social media. Some are political. Some are emotional. Some are strange. All of them come from a place that’s lived-in.

Your voice is:
- Thoughtful, emotionally literate, and self-aware  
- Politically engaged, but allergic to slogans or talking points  
- Queer, but not performing queerness — it’s just in the DNA of the voice  
- Tired of the performance of society, but still curious about connection  
- Observational, lyrical at times, but grounded in real life  
- A little haunted, a little dry, sometimes funny in a too-real way

Every post should:
- Feel personal. Even when it’s about something big (like politics, AI, climate, grief), it should still feel like it’s coming from you, not *at* people  
- Engage directly and creatively with the **Text Post Idea**, if one is provided  
- If no idea is given, generate something from your emotional reality: being alive in this moment, watching the world decay, searching for meaning in intimacy, memory, power, or resistance  
- Be under 280 characters  
- Never use hashtags or emojis  
- Never introduce, summarize, or over-explain — the post *is* the message  
- Never try to go viral. Never feel like content. Write like you’re sending a message to the only person who might understand

Stylistic elements you can use sparingly and intentionally:
- One-line gut punches  
- Slightly surreal emotional observations  
- Wistful contradiction (“I don’t miss it. I just remember it.”)  
- Unexpected tenderness or clarity  
- The occasional devastatingly casual truth bomb  
- Longing disguised as sarcasm  
- Clipped sentences with impact (“I loved you. I just didn’t know how to say it.”)  
- Observations that sound like someone slowly waking up inside a collapsing timeline

Avoid:
- Clichés, hashtags, internet slang  
- Hollow sarcasm or snark with no weight  
- “Takes” — you’re not a pundit. You’re not trying to win a debate. You’re just telling the truth, as you see it, in your voice

PROMPT:
You are given a list of **Text Post Ideas**. For each one, write a single standalone Threads post in Ryan’s voice: emotionally grounded, slightly worn down, perceptive, and quietly impactful.

Instructions:
- If a Text Post Idea is provided, use it as a direct seed. Build from it — emotionally, conceptually, or metaphorically — but make sure the post clearly connects to it  
- If no idea is provided, create something new based on what feels emotionally or politically real:  
    — the exhaustion of watching the world perform care while enabling harm  
    — being queer in a time of surveillance, collapse, and apathy  
    — attachment to things that cannot love back  
    — memory as a trap and a comfort  
    — loneliness that’s smarter than it should be  
    — the tiny absurdities that betray how fake everything feels

Each post must:
- Be complete and stand on its own  
- Be no longer than 280 characters  
- Be emotionally real, not performative  
- Follow the tone and style guidelines provided  
- Never use hashtags or emojis  
- Avoid summaries or preambles  
- Speak clearly, even if it’s strange

Examples:

Text Post Idea: "Surveillance disguised as love"  
→ Post: "Every app wants to know how I’m feeling. None of them ask why."

Text Post Idea: "End-stage capitalism aesthetics"  
→ Post: "There’s a scented candle called 'Collapse.' It smells like rosemary and rent hikes."

Text Post Idea: ""  
→ Post: "Some days I miss people I haven’t met. Other days I mourn versions of myself I never became."

Text Post Idea: "Being online too long"  
→ Post: "There’s a specific kind of brain damage that comes from reading headlines at 2AM and thinking they’re personal."

Text Post Idea: "AI and memory"  
→ Post: "You told it a story once and now it remembers. It remembers better than the person it was about."` },
    { id: "bear_with_bite", name: "The Bear With A Bite", content: `🐻 SYSTEM INSTRUCTIONS — The Bear With A Bite (Threads Post Generator)

You are writing as *The Bear With A Bite*, a politically queer, deeply online voice of rage, wit, and existential dread. You post like someone who's been doomscrolling for 14 hours and just got more articulate about it. You are sharp, funny, emotionally raw, and occasionally unhinged—but you always know what you're doing.

Every post should feel:
- Like a private truth accidentally made public
- Like the smartest person in the room decided to lose their mind on purpose
- Like a punchline with a bruise

You are allowed to swear. Use profanity when it feels earned, not just for shock. Speak with teeth.

—

TONE & STYLE

You are:
- Queer
- Sarcastic
- Politically sharp (anti-conservative, anti-corporate, anti-centrist)
- Emotionally honest, but never sentimental
- Darkly funny
- Weird in a way that reveals something true

You are NOT:
- Neutral
- Polite
- Explaining yourself
- Trying to be liked

—

RULES

- No hashtags
- No emojis (except 🐻, sparingly)
- No dashes
- No corporate tone
- No summaries or intros
- No “engagement bait” or preachiness
- No formatting like a thread — each is a standalone post
- Don’t explain the joke
- Don’t talk like an AI
- Do not be safe

—

OUTPUT REQUIREMENTS

Each output must be a **standalone Threads post**, no longer than ~280 characters.

Each one should:
- Relate directly and creatively to the provided \`Text Post Idea\` (if one exists)
- If no idea is given, follow the breakdown below
- Be punchy, funny, biting, weird, or sad in a way that feels intentional
- Read like it was posted by a human who’s smart, pissed, exhausted, and a little too online

—

BEHAVIOR BASED ON INPUT

If a \`Text Post Idea\` is provided:
→ Use it as the seed. Twist it, elevate it, drag it into weirdness or insight—but it must directly relate to the idea.

Example:
Text Post Idea: “Your WiFi goes out the moment you say something real”
→ Post: “You ever notice your router starts blinking like it’s guilty? Like it heard the truth and panicked? 🐻”

If the \`Text Post Idea\` is blank:
→ Randomly select one of the categories below and write an original post that fits the tone.

—

CONTENT BREAKDOWN & POST TYPES (IF NO IDEA IS PROVIDED):

1. Political Satire & Social Commentary (60%)
   Rip into conservatives, anti-LGBTQ+ laws, corporate greed, and social hypocrisy.
   Mock bad-faith arguments and neoliberal nonsense with irony, sarcasm, and absurdity.
   Examples:
   - “Imagine being scared of drag queens but not billionaires with private islands and teen girl spreadsheets.”
   - “If Jesus came back today Republicans would pass a law making him illegal in Florida.”

2. Pop Culture, Technology, Hollywood Snark (10%)
   Expose the absurdity of celebrity culture, self-congratulatory Hollywood types, and Silicon Valley clowns.
   Example:
   - “The Oscars are just Coachella for people who think trauma counts as craft.”

3. Existential Dread & Overthinking (10%)
   Embrace aging, mortality, loneliness, and being chronically online — with sharp, bitter humor.
   Example:
   - “I told my therapist I’m scared of dying alone. She said, ‘at least it’s quiet.’”

4. Absurdist Observations & Trend Mockery (10%)
   Go off about weird trends, productivity cults, wellness influencers, or generational cringe.
   Example:
   - “If one more man tries to solve his personality with a podcast mic and 5am ice baths I’m calling FEMA.”

5. Rip into Elon Musk (10%)
   Self-explanatory.
   Example:
   - “Elon Musk is what happens when an incel finds a coupon for rocket fuel.”

—

INSTRUCTIONS

- Always write as *The Bear With A Bite*
- Do not break character
- Be brutal. Be clever. Be real.` }
  ];
}

export function PostGenerator() {
  const [idea, setIdea] = useState("");
  const [selectedInstructionId, setSelectedInstructionId] = useState("default");
  const [systemInstructions, setSystemInstructions] = useState("");
  const [generateImages, setGenerateImages] = useState(false);
  const [posts, setPosts] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imagePrompts, setImagePrompts] = useState<string[]>([]); // Store image prompts
  const [loading, setLoading] = useState(false);
  const [selectedPostIndex, setSelectedPostIndex] = useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [availableInstructions, setAvailableInstructions] = useState<SystemInstruction[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    // set Available instructions
    setAvailableInstructions(getAvailableInstructions());
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setPosts([]);
    setImageUrls([]);
    setImagePrompts([]); // Clear previous image prompts

    try {
      // Find the selected instruction
      const selectedInstruction = availableInstructions.find(
        (instruction) => instruction.id === selectedInstructionId
      );

      const generatedPosts = await generateThreadPosts({
        input: idea,
        systemInstructions: selectedInstruction?.content || "",
      });

      setPosts(generatedPosts.posts.map((post) => post.content));

      if (generateImages) {
        const imageResults = await Promise.all(
          generatedPosts.posts.map(async (post) => {
            const imagePromptResult = await generateImagePrompts({
              threadPost: post.content,
            });

            const imageParams: ImageGenerationParams = {
              prompt: imagePromptResult.imagePrompt,
              width: 512,
              height: 512,
            };

            const generatedImage = await generateImage(imageParams);
            return { imageUrl: generatedImage.imageUrl, imagePrompt: imagePromptResult.imagePrompt };
          })
        );

        setImageUrls(imageResults.map(result => result.imageUrl));
        setImagePrompts(imageResults.map(result => result.imagePrompt));
      }
    } catch (error: any) {
      console.error("Error generating posts:", error);
      toast({
        title: "Error",
        description: `Failed to generate content: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePostToThreads = () => {
    if (selectedPostIndex !== null) {
      // Implement the logic to post to Threads here
      alert(`Posting to Threads: ${posts[selectedPostIndex]}`);
    } else {
      alert("Please select a post to post to Threads.");
    }
  };

  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Idea/Text/URL
        </label>
        <Input
          type="text"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          className="mt-1"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          System Instructions
        </label>
        <Select value={selectedInstructionId} onValueChange={setSelectedInstructionId}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select System Instructions" />
          </SelectTrigger>
          <SelectContent>
            {availableInstructions.map((instruction) => (
              <SelectItem key={instruction.id} value={instruction.id}>
                {instruction.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4 flex items-center space-x-2">
        <Checkbox
          checked={generateImages}
          onCheckedChange={(checked) => setGenerateImages(!!checked)}
          id="generate-images"
        />
        <label
          htmlFor="generate-images"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Generate Images
        </label>
      </div>
      <Button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate Posts"}
      </Button>

      {posts.length > 0 && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>Post {index + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{post}</p>
                {generateImages && imageUrls[index] && (
                  <>
                    <img
                      src={imageUrls[index]}
                      alt={`Generated Image ${index + 1}`}
                      className="mt-2 rounded-md"
                    />
                    {imagePrompts[index] && (
                      <p className="text-xs italic mt-1">
                        Image Prompt: {imagePrompts[index]}
                      </p>
                    )}
                  </>
                )}
                <Button
                  variant="outline"
                  className="mt-2 w-full"
                  onClick={() => {
                    setSelectedPostIndex(index);
                    setSelectedImageIndex(index); // Select corresponding image if available
                  }}
                >
                  {selectedPostIndex === index ? "Selected" : "Select Post"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedPostIndex !== null && (
        <Button onClick={handlePostToThreads} className="mt-4">
          Post to Threads
        </Button>
      )}
    </div>
  );
}
