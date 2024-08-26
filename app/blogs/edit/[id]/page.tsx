"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BlogForm from "@/components/BlogForm";

const EditBlogPage = ({ params }: { params: { id: string } }) => {
  const [blog, setBlog] = useState(null);
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    if (id) {
      fetch(`https://airtek-warranty.onrender.com/soreno-blogs/blogs/${id}`)
        .then((res) => res.json())
        .then((data) => setBlog(data))
        .catch((err) => console.error("Failed to fetch blog:", err));
    }
  }, [id]);

  if (!blog) return <p>Loading...</p>;

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="font-bold text-2xl mb-4">Edit Blog</h1>
      <BlogForm blog={blog} />
    </div>
  );
};

export default EditBlogPage;
