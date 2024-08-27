"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { CldUploadWidget } from "next-cloudinary";
import "react-quill/dist/quill.snow.css";
import { useRouter } from "next/navigation";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface BlogData {
  _id?: string;
  title: string;
  thumbnail: string;
  image: string;
  content: string;
}

interface CloudinaryUploadEvent {
  event?: string;
  info: {
    secure_url: string;
  };
}

const BlogForm = ({ blog }: { blog?: BlogData }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<BlogData>({
    _id: blog?._id || "",
    title: blog?.title || "",
    thumbnail: blog?.thumbnail || "",
    image: blog?.image || "",
    content: blog?.content || "",
  });
  const [thumbnailDeleteOpen, setThumbnailDeleteOpen] = useState(false);
  const [imageDeleteOpen, setImageDeleteOpen] = useState(false);
  const [blogDeleteOpen, setBlogDeleteOpen] = useState(false);

  const handleThumbnailUploadSuccess = (data: CloudinaryUploadEvent) => {
    const newThumbnailUrl = data.info.secure_url;
    setFormData((prevData) => ({
      ...prevData,
      thumbnail: newThumbnailUrl,
    }));
  };

  const handleImageUploadSuccess = (data: CloudinaryUploadEvent) => {
    const newImageUrl = data.info.secure_url;
    setFormData((prevData) => ({
      ...prevData,
      image: newImageUrl,
    }));
  };

  const handleThumbnailDelete = () => {
    setFormData((prevData) => ({
      ...prevData,
      thumbnail: "",
    }));
    setThumbnailDeleteOpen(false);
  };

  const handleImageDelete = () => {
    setFormData((prevData) => ({
      ...prevData,
      image: "",
    }));
    setImageDeleteOpen(false);
  };

  const handleSubmit = async () => {
    try {
      const method = formData._id ? "PATCH" : "POST";
      const url = formData._id
        ? `https://airtek-warranty.onrender.com/soreno-blogs/blogs/${formData._id}`
        : `https://airtek-warranty.onrender.com/soreno-blogs/blogs`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await response.json();
      alert(
        formData._id ? "Blog updated successfully!" : "Blog added successfully!"
      );
      router.push("/blogs"); // Redirect to the blog list page
    } catch (error) {
      console.error("Failed to save the blog:", error);
      alert("Failed to save the blog");
    }
  };

  const handleDelete = async () => {
    setBlogDeleteOpen(false);
    try {
      const response = await fetch(
        `https://airtek-warranty.onrender.com/soreno-blogs/blogs/${formData._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      alert("Blog deleted successfully!");
      router.push("/blogs"); // Redirect to the blog list page
    } catch (error) {
      console.error("Failed to delete the blog:", error);
      alert("Failed to delete the blog");
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={12}>
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
        <Grid item xs={12}>
          <ReactQuill
            theme="snow"
            value={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
            style={{ marginBottom: 50, height: 500 }}
          />
        </Grid>
        {formData.thumbnail && (
          <Grid item xs={12} container justifyContent="center">
            <img
              src={formData.thumbnail}
              style={{ width: "50%", maxHeight: "200px", marginBottom: "20px" }}
              alt="Thumbnail"
            />
          </Grid>
        )}
        <Grid item xs={12} container justifyContent="center">
          <CldUploadWidget
            uploadPreset="h74rzzu1"
            onSuccess={(data: any) => handleThumbnailUploadSuccess(data)}
          >
            {({ open }) => (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  if (!formData.thumbnail) {
                    open();
                  } else {
                    alert("Only one thumbnail can be uploaded.");
                  }
                }}
                disabled={Boolean(formData.thumbnail)} // Disable if image exists
                sx={{ mr: 2 }}
              >
                Upload Thumbnail
              </Button>
            )}
          </CldUploadWidget>
          {formData.thumbnail && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setThumbnailDeleteOpen(true)}
            >
              Delete Thumbnail
            </Button>
          )}
        </Grid>
        {formData.image && (
          <Grid item xs={12} container justifyContent="center">
            <img
              src={formData.image}
              style={{ width: "50%", maxHeight: "200px", marginBottom: "20px" }}
              alt="Blog"
            />
          </Grid>
        )}
        <Grid item xs={12} container justifyContent="center">
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
                disabled={Boolean(formData.image)} // Disable if image exists
                sx={{ mr: 2 }}
              >
                Upload Image
              </Button>
            )}
          </CldUploadWidget>
          {formData.image && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setImageDeleteOpen(true)}
            >
              Delete Image
            </Button>
          )}
        </Grid>
        <Grid item xs={12} container justifyContent="center" spacing={2}>
          <Grid item>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              {formData._id ? "Update" : "Submit"}
            </Button>
          </Grid>
          {formData._id && (
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setBlogDeleteOpen(true)}
              >
                Delete Blog
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>

      {/* Dialogs for Image, Thumbnail, and Blog Deletion */}
      <Dialog
        open={thumbnailDeleteOpen}
        onClose={() => setThumbnailDeleteOpen(false)}
      >
        <DialogTitle>Delete Thumbnail</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this thumbnail? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setThumbnailDeleteOpen(false)}>Cancel</Button>
          <Button onClick={handleThumbnailDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={imageDeleteOpen} onClose={() => setImageDeleteOpen(false)}>
        <DialogTitle>Delete Image</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this image? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDeleteOpen(false)}>Cancel</Button>
          <Button onClick={handleImageDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={blogDeleteOpen} onClose={() => setBlogDeleteOpen(false)}>
        <DialogTitle>Delete Blog</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this blog? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBlogDeleteOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BlogForm;
