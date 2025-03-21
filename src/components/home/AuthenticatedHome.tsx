"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Share2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

const AuthenticatedHome = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [ref, inView] = useInView();
  const router = useRouter();
  const initialFetchDone = useRef(false);

  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3002/posts?page=${page}&limit=10`,
        {
          withCredentials: true,
        }
      );

      const newPosts = response.data.items;

      // Check if we've reached the end
      if (newPosts.length === 0) {
        setHasMore(false);
        return;
      }

      // Use a function to update state based on previous state
      setPosts((prevPosts) => {
        // Create a Map of existing posts to check for duplicates
        const existingPostsMap = new Map(
          prevPosts.map((post) => [post.id, post])
        );

        // Filter out duplicates
        const uniqueNewPosts = newPosts.filter(
          (post) => !existingPostsMap.has(post.id)
        );

        return [...prevPosts, ...uniqueNewPosts];
      });

      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    // Only fetch on initial mount
    if (!initialFetchDone.current) {
      fetchPosts();
      initialFetchDone.current = true;
    }
  }, [fetchPosts]);

  useEffect(() => {
    if (inView && initialFetchDone.current) {
      fetchPosts();
    }
  }, [inView, fetchPosts]);

  const handleAction = async (action, postId) => {
    try {
      await axios.post(
        `http://localhost:3002/posts/${postId}/${action}`,
        {},
        {
          withCredentials: true,
        }
      );
      // Update local state to reflect the change
      setPosts(
        posts.map((post) =>
          post.id === postId ? { ...post, [action]: post[action] + 1 } : post
        )
      );
    } catch (error) {
      console.error(`Error ${action}ing post:`, error);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-4 p-4 pb-2">
              <Avatar
                className="h-10 w-10 cursor-pointer"
                onClick={() => router.push(`/users/@${post.user_id}`)}
              >
                <AvatarFallback>
                  {post.username ? post.username.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p
                  className="font-semibold hover:underline cursor-pointer"
                  onClick={() => router.push(`/users/@${post.user_id}`)}
                >
                  {post.name || "Unknown User"}
                </p>
                <p
                  className="text-sm text-muted-foreground hover:underline cursor-pointer"
                  onClick={() => router.push(`/users/@${post.user_id}`)}
                >
                  @{post.user_id}
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="whitespace-pre-wrap">
                {post.post.split(/(#\w+)/g).map((part, index) =>
                  part.startsWith("#") ? (
                    <span
                      key={index}
                      className="text-primary font-medium hover:underline cursor-pointer"
                    >
                      {part}
                    </span>
                  ) : (
                    part
                  )
                )}
              </p>
            </CardContent>

            <CardFooter className="flex justify-between p-4 pt-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
                onClick={() => handleAction("like", post.id)}
              >
                <ThumbsUp className="mr-2 h-4 w-4" /> {post.likes}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-red-50 hover:text-red-600 cursor-pointer"
                onClick={() => handleAction("dislike", post.id)}
              >
                <ThumbsDown className="mr-2 h-4 w-4" /> {post.dislikes}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-green-50 hover:text-green-600 cursor-pointer"
                onClick={() => handleAction("share", post.id)}
              >
                <Share2 className="mr-2 h-4 w-4" /> {post.shares}
              </Button>
            </CardFooter>
          </Card>
        ))}
        {loading && (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        {!loading && !hasMore && posts.length > 0 && (
          <p className="text-center text-muted-foreground py-4">
            No more posts to load
          </p>
        )}
        <div ref={ref} />
      </div>
    </div>
  );
};

export default AuthenticatedHome;
