"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/lib/api";
import { useEffect, useState } from "react";
import { LoadingScreen } from "@/components/loading-screen";
import { CustomArrow } from "@/components/custom-arrow";

interface BlogPost {
  id: string;
  title: string;
  excerpt?: string;
  coverImage?: string;
  slug: string;
  published: boolean;
  tags: string[];
  readTime?: number;
  createdAt: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/blog");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div>
        <LoadingScreen />{" "}
      </div>
    );
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 ">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Sidebar */}

          {/* Main Content */}
          <div className="lg:col-span-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post: any) => (
                <Card
                  key={post.id}
                  className="p-4 h-full sm:p-6 lg:p-2 gradient-card  dark:bg-gradient-to-b dark:from-[#252627] dark:to-[#1E1E1F]
    border border-gray-100/2 hover:gradient-hover transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group mb-4 sm:mb-2 flex-1"
                >
                  <Link
                    href={`/blog/${post.id}`}
                    className="flex flex-col h-full gap-4"
                  >
                    <div className="relative">
                      <div className="aspect-[4/3] overflow-hidden h-48 sm:h-64 w-full">
                        <Image
                          src={post.coverImage || "/placeholder.svg"}
                          alt={post.title}
                          width={400}
                          height={200}
                          className="w-full h-full rounded-sm object-cover bg-[#f5f7f9]"
                        />
                      </div>
                      {post.tags?.[0] && (
                        <Badge className="absolute top-4 right-4 bg-white/90 text-foreground hover:bg-white">
                          {post.tags[0]}
                        </Badge>
                      )}
                    </div>
                    <div className="px-6 flex flex-col flex-1 gap-1">
                      <h2 className="text-[20px] font-[700] black-text mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-[28px] dark:text-[#CDD0DA]">
                        {post.title}
                      </h2>
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src="/user.jpg" alt={post.author} />
                          <AvatarFallback>
                            {(post.author || "A").toString().charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {post.author && (
                          <span className="text-sm gray-text dark:text-[#858B9B]">
                            By {post.author}
                          </span>
                        )}
                        <span className="text-sm gray-text dark:text-[#858B9B]">
                          ~
                        </span>
                        <span className="text-sm gray-text dark:text-[#858B9B]">
                          {new Date(post.createdAt).toDateString()}
                        </span>
                      </div>
                      {post.excerpt && (
                        <p className="text-[16px] gray-text dark:text-[#858B9B] mb-4 line-clamp-2 leading-[24px]">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex justify-between">
                        {/* <Link href={`/blog/${post.id}`}> */}
                        <div className=" text-[14px] sm:text-[16px]  leading-[25px]">
                          <p className="hover:border-b border-b-[#2F3236]">
                            Read More
                          </p>
                        </div>
                        {/* </Link> */}
                        <div className="flex items-center justify-center hover:text-gray-500">
                          <CustomArrow className="h-10 w-10 shrink-0 transition-transform group-hover:translate-x-1 text-gray-400 " />
                        </div>
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <div className="text-center mt-10">
          <Button className="bg-white/80 text-[#2F3236] hover:bg-[#2F3236] dark:bg-gradient-to-b dark:from-[#303131] dark:to-[#1E1E1F] dark:border-[#252627] dark:text-white hover:text-white border border-gray-100 px-6 sm:px-10 py-5 rounded-full text-[14px] sm:text-base">
            Load More Blogs
          </Button>
        </div>
      </main>
    </div>
  );
}
