import React from "react";
import BlogForm from "@/components/BlogForm";

const CreateBlogPage = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="font-bold text-2xl mb-4">Add New Blog</h1>
      <BlogForm />
    </div>
  );
};

export default CreateBlogPage;
