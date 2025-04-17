"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateThreadPosts } from "@/ai/flows/generate-thread-posts";
import { generateImagePrompts } from "@/ai/flows/generate-image-prompts";
import { generateImage, ImageGenerationParams } from "@/services/leonardo-ai";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useControlPanelContext } from "@/components/control-panel-provider";

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
    { id: "ryan_voice", name: "Ryan Expert", content: "Write as a Ryan expert." },
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
- Read like a human who’s smart, pissed, exhausted, and a little too online

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
- Be brutal. Be clever. Be real.` },
      { id: "image_instructions", name: "Image Instructions", content: `**Objective**: Generate photo realistic images of HUMAN men resembling the AI-generated "bears" from https://www.instagram.com/thebearwithabite/, with consistent traits: approximately 40 years old, slightly overweight, but not obese with facial hair, ethnically ambiguous, exuding coolness, and *always wearing a bear costume headpiece* that **reveals the full face** while limiting recognition through dark/mirrored sunglasses or facial shadows for a sense of anonymity. These are not real bears - they are gay men in wearing bear costume head pieces! Do not generate cartoon bears!!


#### Key Parameters:
1. **Age & Build**:
   - "40-year-old man, good-looking slighly chubby dad type."
   - "Stocky build, a little chubby around the midsection, slightly overweight, not obese, dad-bod, ex-football player"

2. **Facial Hair**:
   - "Thick, well-groomed beard or mustache, medium-length, textured, dark brown or salt-and-pepper coloring"
   - Variations: "scruffy stubble" or "full bushy beard" or "handlebar moustache" for diversity

3. **Ethnic Ambiguity**:
   - "Medium skin tone, blended ethnic features (hints of Mediterranean, Middle Eastern, or Latin heritage - mixed), dark eyes.
   - Avoid overly specific racial markers to maintain ambiguity. 
   
4. **Bear Costume Headpiece**:
   - "Wearing a cute and plush bear costume headpiece, realistic or stylized bear ears and fur framing the head, full face exposed and visible, no mask covering the mouth or eyes"
   - "Headpiece sits snugly, blending into the hairline or shoulders"

5. **Anonymity Feature**:
   - Default: "Wearing tinted sunglasses or mirrored sunglasses that reflect light, obscuring the eyes and limiting recognition"
   - Alternative: "Face partially shadowed, dramatic lighting casting soft shadows over the upper face, maintaining visibility but adding mystery"
   - Ensure: "Full facial features (beard, mouth, jaw) remain clear: only eye recognition is reduced"

6. **Expression & Importance**:
   - "Confident expression, slight smirk or stern look behind sunglasses/shadows"
   - "Aura of authority, gravitas, or enigmatic strength"

7. **Clothing & Context**:
   - "Relaxed and casual—flannel shirts, jeans, shorts, leather jacket, or henley, slightly rugged, bear costume headpiece integrated naturally"
   - Optional variations: "Loose muscle shirt (open-collared shirt, blazer)" or "Relaxed outdoor gear (parka, scarf)" to suggest importance in different settings also "reveling revealing clothing (shirtless, muscle shirts, shorts, leather vests, tight jeans, chest harness etc.) to show some skin and sexiness.

8. **Art Style & Technical Details**:
   - "Hyper photo-realistic rendering, photograph, natural lighting, shallow depth of field, medium shot, cinematic composition, vivid colors."

#### Usage Instructions:
- Specify sunglasses type (e.g., "pink mirrored aviators") or shadow style (e.g., "harsh side lighting") for variation.
- The bear headpiece should always frame the face, never cover it—think mascot-style but sleek and integrated.

                               
                                ** Be sure our HERO (🐻) is featured as the main character in your image prompts.**
 
  After that, be super creative! Ensure the images reflect the topic's tone, mood, and theme.  They can be whimsical, magical, surreal, colorful, cinematic, and photo-realistic. Avoid dark or gritty toneed scenes. Keep it funny. Embrace creativity with literary, pop-culture, musical, or cinematic elements. He loves taking selfies!
  
  RULE:
  
  Generate the impage prompt (setting, activity, clothing, tone, mood, etc.) based of the following concept/idea:
  ` }
  ];
}

export function PostGenerator() {
  const [idea, setIdea] = useState("");
  const [selectedInstructionId, setSelectedInstructionId] = useState("default");
  const [selectedImageInstructionId, setSelectedImageInstructionId] = useState("image_instructions");
  const [generateImages, setGenerateImages] = useState(false);
  const [posts, setPosts] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imagePrompts, setImagePrompts] = useState<string[]>([]); // Store image prompts
  const [loading, setLoading] = useState(false);
  const [selectedPostIndex, setSelectedPostIndex] = useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [availableInstructions, setAvailableInstructions] = useState<SystemInstruction[]>([]);

  const { toast } = useToast();
  const { logApiCall } = useControlPanelContext();

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

      const selectedImageInstruction = availableInstructions.find(
        (instruction) => instruction.id === selectedImageInstructionId
      );

      const generateThreadPostsInput = {
        input: idea,
        systemInstructions: selectedInstruction?.content || "",
      };

      logApiCall("Generating thread posts",
        "/ai/flows/generate-thread-posts",
        generateThreadPostsInput,
        null,
        200
      );

      const generatedPosts = await generateThreadPosts(generateThreadPostsInput);

      logApiCall("Generated thread posts",
        "/ai/flows/generate-thread-posts",
        generateThreadPostsInput,
        generatedPosts,
        200
      );

      setPosts(generatedPosts.posts.map((post) => post.content));

      if (generateImages) {
        const imageResults = await Promise.all(
          generatedPosts.posts.map(async (post) => {
            // Combine image instructions and the generated thread post
            const combinedPrompt = `${selectedImageInstruction?.content || ""} ${post.content}`;

            const generateImagePromptsInput = {
              threadPost: combinedPrompt,
            };

            logApiCall("Generating image prompts",
              "/ai/flows/generate-image-prompts",
              generateImagePromptsInput,
              null,
              200
            );

            const imagePromptResult = await generateImagePrompts(generateImagePromptsInput);

            logApiCall("Generated image prompts",
              "/ai/flows/generate-image-prompts",
              generateImagePromptsInput,
              imagePromptResult,
              200
            );

            const imageParams: ImageGenerationParams = {
              prompt: imagePromptResult.imagePrompt,
              width: 512,
              height: 512,
            };

            logApiCall("Generating image",
              "/services/leonardo-ai",
              imageParams,
              null,
              200
            );

            const generatedImage = await generateImage(imageParams, logApiCall);

             logApiCall("Generated image",
              "/services/leonardo-ai",
              imageParams,
              generatedImage,
              200
            );

            return { imageUrl: generatedImage.imageUrl, imagePrompt: imageParams.prompt };
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
              instruction.id !== "image_instructions" && (
                <SelectItem key={instruction.id} value={instruction.id}>
                  {instruction.name}
                </SelectItem>
              )
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Image Instructions
        </label>
        <Select value={selectedImageInstructionId} onValueChange={setSelectedImageInstructionId}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select Image Instructions" />
          </SelectTrigger>
          <SelectContent>
            {availableInstructions.map((instruction) => (
              instruction.id === "image_instructions" && (
                <SelectItem key={instruction.id} value={instruction.id}>
                  {instruction.name}
                </SelectItem>
              )
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
