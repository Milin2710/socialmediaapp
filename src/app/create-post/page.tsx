"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";
import { Plus, Minus } from "lucide-react";

export default function CreatePostPage() {
  const router = useRouter();
  const [postText, setPostText] = useState("");
  const [pollText, setPollText] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePostSubmit = async () => {
    if (!postText.trim()) {
      toast.error("Post cannot be empty");
      return;
    }

    setIsSubmitting(true);
    try {
      const hashtags = postText.match(/#(\w+)/g)?.map(tag => tag.substring(1)).join(" ") || "";
      
      await axios.post(
        "http://localhost:3002/posts",
        {
          post: postText,
          tags: hashtags
        },
        {
          withCredentials: true,
        }
      );

      toast.success("Post created successfully!");
      router.push("/");
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePollSubmit = async () => {
    if (!pollText.trim()) {
      toast.error("Poll question cannot be empty");
      return;
    }

    // Filter out empty options
    const validOptions = pollOptions.filter(option => option.trim() !== "");
    
    if (validOptions.length < 2) {
      toast.error("Please provide at least two poll options");
      return;
    }

    setIsSubmitting(true);
    try {
      // Extract hashtags from poll text
      const hashtags = pollText.match(/#(\w+)/g)?.map(tag => tag.substring(1)).join(" ") || "";
      
      // Create poll data object
      const pollData = {
        post: pollText,
        number_of_options: validOptions.length,
        tags: hashtags
      };
      
      // Add options to poll data
      validOptions.forEach((option, index) => {
        pollData[`option${index + 1}`] = option;
      });

      await axios.post(
        "http://localhost:3002/polls",
        pollData,
        {
          withCredentials: true,
        }
      );

      toast.success("Poll created successfully!");
      router.push("/");
    } catch (error) {
      console.error("Failed to create poll:", error);
      toast.error("Failed to create poll");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, ""]);
    } else {
      toast.error("Maximum 4 options allowed");
    }
  };

  const removePollOption = () => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.slice(0, -1));
    }
  };

  const handlePollOptionChange = (index, value) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      
      <Tabs defaultValue="post" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="post">Text Post</TabsTrigger>
          <TabsTrigger value="poll">Poll</TabsTrigger>
        </TabsList>
        
        <TabsContent value="post">
          <Card>
            <CardHeader>
              <CardTitle>Create Text Post</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="post-text">What's on your mind?</Label>
                  <Textarea
                    id="post-text"
                    placeholder="Share your thoughts... Use #hashtags to categorize your post"
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    rows={6}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={handlePostSubmit} 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Posting..." : "Post"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="poll">
          <Card>
            <CardHeader>
              <CardTitle>Create Poll</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="poll-text">Poll Question</Label>
                  <Textarea
                    id="poll-text"
                    placeholder="Ask a question... Use #hashtags to categorize your poll"
                    value={pollText}
                    onChange={(e) => setPollText(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-4">
                  <Label>Poll Options</Label>
                  {pollOptions.map((option, index) => (
                    <Input
                      key={index}
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => handlePollOptionChange(index, e.target.value)}
                    />
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addPollOption}
                    disabled={pollOptions.length >= 4}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Option
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={removePollOption}
                    disabled={pollOptions.length <= 2}
                  >
                    <Minus className="h-4 w-4 mr-1" /> Remove Option
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={handlePollSubmit} 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Poll..." : "Create Poll"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
