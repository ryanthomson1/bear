"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define a type for system instructions
interface SystemInstruction {
  id: string;
  name: string;
  content: string;
}

interface ControlPanelContextType {
  logApiCall: (description: string, url: string, request: any, response: any, status: number) => void;
}

const ControlPanelContext = createContext<ControlPanelContextType>({
  logApiCall: () => {},
});

export const useControlPanelContext = () => {
  return useContext(ControlPanelContext);
};

export function ControlPanel() {
  const [aiModel, setAiModel] = useState("Gemini");
  const [threadsAccount, setThreadsAccount] = useState("bearwithabite");

  // Define initial system instructions
  const initialSystemInstructions = [
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
- Feel like a private truth accidentally made public
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
- Be brutal. Be clever. Be real.` },
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
   - Default: "Relaxed and casual—flannel shirts, jeans, shorts, leather jacket, or henley, slightly rugged, bear costume headpiece integrated naturally"
   - Optional variations: "Loose muscle shirt (open-collared shirt, blazer)" or "Relaxed outdoor gear (parka, scarf)" to suggest importance in different settings also "reveling revealing clothing (shirtless, muscle shirts, shorts, leather vests, tight jeans, chest harness etc.) to show some skin and sexiness.

8. **Art Style & Technical Details**:
   - "Hyper photo-realistic rendering, photograph, natural lighting, shallow depth of field, medium shot, cinematic composition, vivid colors."

#### Usage Instructions:
- Specify sunglasses type (e.g., "pink mirrored aviators") or shadow style (e.g., "harsh side lighting") for variation.
- The bear headpiece should always frame the face, never cover it—think mascot-style but sleek and integrated.

                               
                                ** Be sure our HERO (🐻) is featured as the main character in your image prompts.**
 
  After that, be super creative! Ensure the images reflect the topic's tone, mood, and theme.  They can be whimsical, magical, surreal, colorful, cinematic, and photo-realistic. Avoid dark or gritty toneed scenes. Keep it funny. Embrace creativity with literary, pop-culture, musical, or cinematic elements. He loves taking selfies!` }
  ];

  const [availableInstructions, setAvailableInstructions] = useState<SystemInstruction[]>(initialSystemInstructions);
  const [selectedInstructionId, setSelectedInstructionId] = useState("default");
  const [systemInstructions, setSystemInstructions] = useState(availableInstructions.find(instruction => instruction.id === "default")?.content || "");

  // Image Instructions
  const [selectedImageInstructionId, setSelectedImageInstructionId] = useState("image_instructions");
  const [imageInstructions, setImageInstructions] = useState(availableInstructions.find(instruction => instruction.id === "image_instructions")?.content || "");

  const { toast } = useToast();
  const { logApiCall } = useControlPanelContext();

  useEffect(() => {
    // Update systemInstructions when selectedInstructionId changes
    const selectedInstruction = availableInstructions.find(instruction => instruction.id === selectedInstructionId);
    setSystemInstructions(selectedInstruction?.content || "");

     const selectedImageInstruction = availableInstructions.find(instruction => instruction.id === selectedImageInstructionId);
     setImageInstructions(selectedImageInstruction?.content || "");
  }, [selectedInstructionId, selectedImageInstructionId, availableInstructions]);

  const handleSaveInstructions = (instructionType: 'text' | 'image') => {
    const instructionContent = instructionType === 'text' ? systemInstructions : imageInstructions;
    const selectedId = instructionType === 'text' ? selectedInstructionId : selectedImageInstructionId;

    setAvailableInstructions(prevInstructions => {
      const updatedInstructions = prevInstructions.map(instruction =>
        instruction.id === selectedId ? { ...instruction, content: instructionContent } : instruction
      );

      if (!updatedInstructions.find(instruction => instruction.id === selectedId)) {
        toast({
          title: "Error",
          description: `Selected ${instructionType} system instruction not found.`,
          variant: "destructive",
        });
        return prevInstructions;
      }

      toast({
        title: "Success",
        description: `${instructionType} system instructions saved!`,
      });
      return updatedInstructions;
    });
  };

  const [apiLogs, setApiLogs] = useState<string>("");

  

  return (
    <div>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>AI Model Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={aiModel} onValueChange={setAiModel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select AI Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Gemini">Gemini</SelectItem>
              <SelectItem value="GPT">GPT</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Threads Account Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={threadsAccount} onValueChange={setThreadsAccount}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Account" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thebearwithabite">thebearwithabite</SelectItem>
              <SelectItem value="anotheraccount">anotheraccount</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>System Instructions Management (Text)</CardTitle>
        </CardHeader>
        <CardContent>
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
          <Textarea
            value={systemInstructions}
            onChange={(e) => setSystemInstructions(e.target.value)}
            className="mb-2 mt-2"
            placeholder="Enter system instructions"
          />
          <Button onClick={() => handleSaveInstructions('text')}>Save Instructions</Button>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>System Instructions Management (Image)</CardTitle>
        </CardHeader>
        <CardContent>
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
          <Textarea
            value={imageInstructions}
            onChange={(e) => setImageInstructions(e.target.value)}
            className="mb-2 mt-2"
            placeholder="Enter image generation instructions"
          />
          <Button onClick={() => handleSaveInstructions('image')}>Save Image Instructions</Button>
        </CardContent>
      </Card>


       <Card className="mb-4">
        <CardHeader>
          <CardTitle>Debugging Logs</CardTitle>
        </CardHeader>
        <CardContent>
           <ScrollArea className="h-80 w-full rounded-md border">
            <Textarea
              readOnly
              value={apiLogs}
              placeholder="API call logs will appear here"
              className="min-h-[80px] font-mono text-xs"
            />
           </ScrollArea>
        </CardContent>
      </Card>

      {/* Account Management and Monitoring sections can be added here */}
    </div>
  );
}


