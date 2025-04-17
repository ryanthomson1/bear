"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getThreadsPosts, ThreadPost } from "@/services/threads-api";
import { suggestThreadReplies } from "@/ai/flows/suggest-thread-replies";

export function ReplySuggestions() {
  const [posts, setPosts] = useState<ThreadPost[]>([]);
  const [replies, setReplies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3; // Display 3 posts per page
  const [filters, setFilters] = useState({
    user: "",
    topic: "",
  });

  useEffect(() => {
    loadPosts();
  }, [currentPage, filters]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const fetchedPosts = await getThreadsPosts(filters, postsPerPage, "");
      setPosts(fetchedPosts);
      const suggestedReplies = await Promise.all(
        fetchedPosts.map(async (post) => {
          const reply = await suggestThreadReplies({ postContent: post.content });
          return reply.replySuggestion;
        })
      );
      setReplies(suggestedReplies);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostReply = (index: number) => {
    // Implement logic to post the reply to Threads
    alert(`Posting reply: ${replies[index]} to thread: ${posts[index].content}`);
  };

  const handleGenerateNewReply = async (index: number) => {
    setLoading(true);
    try {
      const reply = await suggestThreadReplies({ postContent: posts[index].content });
      const newReplies = [...replies];
      newReplies[index] = reply.replySuggestion;
      setReplies(newReplies);
    } catch (error) {
      console.error("Error generating reply:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditReply = (index: number, newReply: string) => {
    const newReplies = [...replies];
    newReplies[index] = newReply;
    setReplies(newReplies);
  };

  const totalPages = Math.ceil(posts.length / postsPerPage);

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              User
            </label>
            <Input
              type="text"
              value={filters.user}
              onChange={(e) =>
                setFilters({ ...filters, user: e.target.value })
              }
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Topic
            </label>
            <Input
              type="text"
              value={filters.topic}
              onChange={(e) =>
                setFilters({ ...filters, topic: e.target.value })
              }
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div>Loading posts...</div>
      ) : (
        <>
          {posts.slice(
            (currentPage - 1) * postsPerPage,
            currentPage * postsPerPage
          ).map((post, index) => {
            const postIndex = (currentPage - 1) * postsPerPage + index;
            return (
              <Card key={postIndex} className="mb-4">
                <CardHeader>
                  <CardTitle>Thread Post</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{post.content}</p>
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt="Thread Post Image"
                      className="mt-2 rounded-md"
                    />
                  )}
                  <Textarea
                    value={replies[postIndex] || ""}
                    onChange={(e) =>
                      handleEditReply(postIndex, e.target.value)
                    }
                    className="mt-2"
                  />
                  <div className="flex justify-end space-x-2 mt-2">
                    <Button
                      variant="secondary"
                      onClick={() => handleGenerateNewReply(postIndex)}
                      disabled={loading}
                    >
                      {loading ? "Generating..." : "Generate New Reply"}
                    </Button>
                    <Button onClick={() => handlePostReply(postIndex)}>
                      Post Reply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <div className="flex justify-between items-center">
            <Button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              variant="outline"
            >
              Previous Page
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              variant="outline"
            >
              Next Page
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
