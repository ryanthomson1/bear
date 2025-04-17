"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ControlPanel() {
  const [aiModel, setAiModel] = useState("Gemini");
  const [threadsAccount, setThreadsAccount] = useState("bearwithabite");
  const [systemInstructions, setSystemInstructions] = useState("");

  const handleSaveInstructions = () => {
    // Implement logic to save system instructions
    alert("System instructions saved!");
  };

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
              <SelectItem value="bearwithabite">bearwithabite</SelectItem>
              <SelectItem value="anotheraccount">anotheraccount</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>System Instructions Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={systemInstructions}
            onChange={(e) => setSystemInstructions(e.target.value)}
            className="mb-2"
            placeholder="Enter system instructions"
          />
          <Button onClick={handleSaveInstructions}>Save Instructions</Button>
        </CardContent>
      </Card>

      {/* Account Management and Monitoring sections can be added here */}
    </div>
  );
}
