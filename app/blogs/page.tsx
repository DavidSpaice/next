import BlogForm from "@/components/BlogForm";
import React from "react";

function page() {
  return (
    <div className="flex flex-col justify-center items-center">
        <h1 className="font-bold">Add New Blog</h1>
      <BlogForm />
    </div>
  );
}

export default page;
