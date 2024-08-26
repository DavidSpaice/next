"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BlogList from "@/components/BlogList";
import Pagination from "@/components/Pagination";
import { Button } from "@nextui-org/react";

interface BlogData {
  _id: string;
  title: string;
  image: string;
  content: string;
  date: string;
}

const BlogsPage = () => {
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 9; // Number of blogs per page
  const router = useRouter(); // Initialize the useRouter hook

  useEffect(() => {
    fetchBlogs(currentPage);
  }, [currentPage]);

  const fetchBlogs = async (page: number) => {
    try {
      const response = await fetch(
        `https://airtek-warranty.onrender.com/soreno-blogs/blogs?page=${page}&limit=${blogsPerPage}`
      );
      const data = await response.json();
      setBlogs(data.blogs);
      setTotalBlogs(data.total);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    }
  };

  // Function to handle redirecting to the create page
  const handleAddNewBlog = () => {
    router.push("/blogs/create");
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="font-bold text-2xl mb-4">Blogs</h1>
      <div className="w-full flex flex-row justify-end items-center mr-6 mb-6">
        <Button onClick={handleAddNewBlog}>Add New Blog</Button>
      </div>
      <BlogList blogs={blogs} />
      <Pagination
        currentPage={currentPage}
        totalItems={totalBlogs}
        itemsPerPage={blogsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default BlogsPage;
