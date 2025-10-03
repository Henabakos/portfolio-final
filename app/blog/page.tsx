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
                  className="p-4 h-full sm:p-6 lg:p-2 gradient-card hover:gradient-hover transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group mb-4 sm:mb-2 flex-1"
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
                    <h2 className="text-[20px] font-[700] black-text mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-[28px]">
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
                        <span className="text-sm gray-text">
                          By {post.author}
                        </span>
                      )}
                      <span className="text-sm gray-text">~</span>
                      <span className="text-sm gray-text">
                        {new Date(post.createdAt).toDateString()}
                      </span>
                    </div>
                    {post.excerpt && (
                      <p className="text-[16px] gray-text mb-4 line-clamp-2 leading-[24px]">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex justify-between">
                      <Link href={`/blog/${post.id}`}>
                        <div className=" text-[14px] sm:text-[16px]  leading-[25px]">
                          <p className="hover:border-b border-b-[#2F3236]">
                            Read More
                          </p>
                        </div>
                      </Link>
                      <div className="flex items-center justify-center hover:text-gray-500">
                        <CustomArrow className="h-10 w-10 shrink-0 transition-transform group-hover:translate-x-1 text-gray-400 " />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <div className="text-center mt-10">
          <Button className="bg-white/50 text-[#2F3236] hover:bg-[#2F3236] hover:text-white border border-gray-100 px-6 sm:px-10 py-5 rounded-full text-[14px] sm:text-base">
            Load More Blogs
          </Button>
        </div>

        <div className="mt-20">
          <Card className="p-4 sm:p-6 lg:p-8 gradient-card hover:gradient-hover transition-all duration-300 hover:scale-[1.02] group mb-4 sm:mb-5 flex-1">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold black-text mb-4">
                Get In Touch
              </h2>
              <p className="text-[16px] lg:text-[18px] gray-text max-w-2xl mx-auto">
                Have a project in mind or want to collaborate? I'd love to hear
                from you. Let's create something amazing together.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* Contact Info */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold black-text">Email</h3>
                    <p className="gray-text">henogato9876@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold black-text">Phone</h3>
                    <p className="gray-text">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold black-text">Location</h3>
                    <p className="gray-text">San Francisco, CA</p>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="space-y-4">
                <Input
                  placeholder="Your Name"
                  className="bg-white/50 border-gray-200 focus:border-gray-400"
                />
                <Input
                  placeholder="Your Email"
                  type="email"
                  className="bg-white/50 border-gray-200 focus:border-gray-400"
                />
                <Input
                  placeholder="Subject"
                  className="bg-white/50 border-gray-200 focus:border-gray-400"
                />
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-md focus:border-gray-400 focus:outline-none resize-none"
                />
                <Button className="w-full bg-[#2F3236] text-white hover:bg-[#1a1d20] py-3">
                  Send Message
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
