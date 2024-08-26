"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface BlogData {
  _id: string;
  title: string;
  image: string;
  content: string;
  date: string;
}

interface BlogListProps {
  blogs: BlogData[];
}

const BlogList: React.FC<BlogListProps> = ({ blogs }) => {
  const router = useRouter();

  const handleEdit = (blogId: string) => {
    router.push(`/blogs/edit/${blogId}`);
  };

  return (
    <ul className="w-full">
      {blogs.map((blog) => (
        <li
          key={blog._id}
          className="border p-4 mb-2 w-full cursor-pointer"
          onClick={() => handleEdit(blog._id)}
        >
          <h2 className="font-bold text-xl">{blog.title}</h2>
          <p>{new Date(blog.date).toLocaleDateString()}</p>
        </li>
      ))}
    </ul>
  );
};

export default BlogList;
