import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Heart, MessageCircle, Share2, Send, Users } from "lucide-react";
import type { Post } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

interface PostWithUser extends Post {
  user?: {
    fullName: string;
    username: string;
  };
}

export default function Community() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [postContent, setPostContent] = useState("");

  const { data: posts = [] } = useQuery<PostWithUser[]>({
    queryKey: ["/api/posts"],
  });

  const createPostMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/posts", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Post shared!",
        description: "Your progress has been shared with the community.",
      });
      setPostContent("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to share post",
        variant: "destructive",
      });
    },
  });

  const likePostMutation = useMutation({
    mutationFn: (postId: string) => apiRequest("POST", `/api/posts/${postId}/like`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    createPostMutation.mutate({
      content: postContent,
    });
  };

  return (
    <div className="container py-8 px-4 max-w-4xl">
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-4xl font-bold mb-2">Community</h1>
          <p className="text-muted-foreground">Share your journey and get inspired</p>
        </div>

        {/* Create Post */}
        <Card className="border-2" data-testid="card-create-post">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.fullName?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{user?.fullName}</p>
                <p className="text-sm text-muted-foreground">@{user?.username}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreatePost} className="space-y-3">
              <Textarea
                placeholder="Share your fitness journey, achievements, or motivation..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="min-h-24"
                data-testid="input-post-content"
              />
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={!postContent.trim() || createPostMutation.isPending}
                  data-testid="button-share-post"
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  {createPostMutation.isPending ? "Sharing..." : "Share"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <Card className="border-2">
              <CardContent className="py-12 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No posts yet. Be the first to share!</p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="border-2 hover-elevate transition-all" data-testid={`post-${post.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {post.user?.fullName?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold">{post.user?.fullName || "User"}</p>
                      <p className="text-sm text-muted-foreground">
                        @{post.user?.username || "unknown"} • {format(new Date(post.createdAt), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground whitespace-pre-wrap" data-testid={`post-content-${post.id}`}>
                    {post.content}
                  </p>
                  
                  {post.imageUrl && (
                    <img 
                      src={post.imageUrl} 
                      alt="Post" 
                      className="rounded-lg w-full object-cover max-h-96"
                    />
                  )}

                  <div className="flex items-center gap-4 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => likePostMutation.mutate(post.id)}
                      className="gap-2"
                      data-testid={`button-like-${post.id}`}
                    >
                      <Heart className={`h-4 w-4 ${post.likes > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                      <span className="font-mono">{post.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <MessageCircle className="h-4 w-4" />
                      <span>Comment</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Share2 className="h-4 w-4" />
                      <span>Share</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
