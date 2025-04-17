"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostGenerator } from "@/components/post-generator";
import { ReplySuggestions } from "@/components/reply-suggestions";
import { ControlPanel } from "@/components/control-panel";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ThreadForge AI</h1>
      <Tabs defaultValue="generate" className="w-full">
        <TabsList>
          <TabsTrigger value="generate">Generate Posts</TabsTrigger>
          <TabsTrigger value="reply">Reply Suggestions</TabsTrigger>
          <TabsTrigger value="control">Control Panel</TabsTrigger>
        </TabsList>
        <TabsContent value="generate">
          <PostGenerator />
        </TabsContent>
        <TabsContent value="reply">
          <ReplySuggestions />
        </TabsContent>
        <TabsContent value="control">
          <ControlPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
