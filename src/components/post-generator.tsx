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

// Define a type for system instructions
interface SystemInstruction {
  id: string;
  name: string;
  content: string;
}

// Hypothetical function to fetch system instructions
const fetchSystemInstructions = async (): Promise<SystemInstruction[]> => {
  // Replace this with actual data fetching logic
  return [
    { id: "default", name: "Default Instructions", content: "Be creative and engaging." },
    { id: "ai_expert", name: "AI Expert", content: "Write as an AI expert." },
  ];
};

export function PostGenerator() {
  const [idea, setIdea] = useState("");
  const [selectedInstructionId, setSelectedInstructionId] = useState("default");
  const [systemInstructions, setSystemInstructions] = useState("");
  const [generateImages, setGenerateImages] = useState(false);
  const [posts, setPosts] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPostIndex, setSelectedPostIndex] = useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [availableInstructions, setAvailableInstructions] = useState<SystemInstruction[]>([]);

    useEffect(() => {
    const loadInstructions = async () => {
      const instructions = await fetchSystemInstructions();
      setAvailableInstructions(instructions);
    };

    loadInstructions();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setPosts([]);
    setImageUrls([]);

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
        const generatedImageUrls = await Promise.all(
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
            return generatedImage.imageUrl;
          })
        );
        setImageUrls(generatedImageUrls);
      }
    } catch (error) {
      console.error("Error generating posts:", error);
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
                  <img
                    src={imageUrls[index]}
                    alt={`Generated Image ${index + 1}`}
                    className="mt-2 rounded-md"
                  />
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
