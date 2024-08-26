"use client";
import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Grid from "@mui/material/Grid";

interface BlogData {
  title: string;
  image: string;
  content: string;
}

interface CloudinaryUploadInfo {
  id: string;
  batchId: string;
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  original_filename: string;
  path: string;
  thumbnail_url: string;
}

interface CloudinaryUploadEvent {
  event?: string;
  info: CloudinaryUploadInfo;
}

const BlogForm = ({ blog }: { blog?: BlogData }) => {
  const [formData, setFormData] = useState<BlogData>({
    title: blog?.title || "",
    image: blog?.image || "",
    content: blog?.content || "",
  });

  const handleImageUploadSuccess = (data: CloudinaryUploadEvent) => {
    const newImageUrl = data.info.secure_url;
    setFormData((prevData) => ({
      ...prevData,
      image: newImageUrl,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        "https://airtek-warranty.onrender.com/soreno-blogs/blogs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await response.json(); // You may need this step if you want to do something with the response data
      alert("Blog added successfully!");
    } catch (error) {
      console.error("Failed to add the blog:", error);
      alert("Failed to add blog");
    }
  };

  return (
    <Box sx={{ maxWidth: 2000, mx: "auto", p: 3 }}>
      <Grid container justifyContent="center" alignItems="center" columns={12}>
        <Grid xs={12}>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            name="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
            margin="normal"
          />
        </Grid>
        <Grid xs={12}>
          <ReactQuill
            theme="snow"
            value={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
            style={{ marginBottom: 50, height: 400 }}
          />

          {formData.image && (
            <Box
              component="img"
              src={formData.image}
              sx={{ width: "100%", my: 2 }}
            />
          )}
        </Grid>
        <Grid container justifyContent="center" alignItems="center" xs={12}>
          <CldUploadWidget
            uploadPreset="h74rzzu1"
            onSuccess={(data: any) => handleImageUploadSuccess(data)}
          >
            {({ open }) => (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  if (!formData.image) {
                    open();
                  } else {
                    alert("Only one image can be uploaded.");
                  }
                }}
                disabled={Boolean(formData.image)} // Use formData here, not BlogData
              >
                Upload Image
              </Button>
            )}
          </CldUploadWidget>
        </Grid>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          item
          xs={12}
        >
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BlogForm;
