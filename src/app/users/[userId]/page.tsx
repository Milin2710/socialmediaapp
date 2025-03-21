"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Share2 } from "lucide-react";

const UserPage = () => {
  const router = useRouter();
  const params = useParams();
  const encodedUserId = params.userId;
  const userId = decodeURIComponent(encodedUserId);
  console.log(userId);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:3002/users/${userId}`,
            {
              withCredentials: true,
            }
          );
          setUserData(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>User not found</div>;
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={userData.avatar || ""} alt={userData.name} />
            <AvatarFallback>{userData.name[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{userData.name}</CardTitle>
            <p className="text-sm text-muted-foreground">@{userData.user_id}</p>
            {userData.is_public && (
              <p className="text-sm text-muted-foreground mt-1">
                {userData.email}
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{userData.bio}</p>
          {userData.is_public && (
            <p className="text-sm text-muted-foreground">
              Joined on {new Date(userData.created_at).toLocaleDateString()}
            </p>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="posts" className="mt-8">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="polls">Polls</TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          {userData.posts.map((post) => (
            <Card key={post.id} className="mb-4">
              <CardContent className="pt-6">
                <p>{post.post}</p>
                <div className="flex justify-between mt-4">
                  <Button variant="ghost" size="sm">
                    <ThumbsUp className="mr-2 h-4 w-4" /> {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ThumbsDown className="mr-2 h-4 w-4" /> {post.dislikes}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="mr-2 h-4 w-4" /> {post.shares}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserPage;
