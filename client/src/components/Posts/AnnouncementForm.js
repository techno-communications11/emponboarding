import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AnnouncementForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [filter, setFilter] = useState("none");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user data from /users/me
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users/me`, {
          method: "GET",
          credentials: "include", // Send HTTP-only cookie
        });
        if (!response.ok) {
          throw new Error("Failed to authenticate. Please log in.");
        }
        const data = await response.json();
        if (data.role !== "Admin") {
          setError("Only admins can create announcements.");
          navigate("/"); // Redirect non-admins
        } else {
          setUserId(data.id);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error.message);
        navigate("/"); // Redirect to login
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError("User not authenticated. Please log in.");
      return;
    }
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("admin_id", userId);
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/createannouncement`, {
        method: "POST",
        credentials: "include", // Send HTTP-only cookie
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to post announcement.");
      }
      setSuccess("Announcement posted successfully!");
      setTitle("");
      setContent("");
      setImage(null);
      setImagePreview(null);
      setFilter("none");
    } catch (error) {
      console.error("Error posting announcement:", error);
      setError(error.message);
    }
  };

  const filterStyles = {
    none: "none",
    grayscale: "grayscale(100%)",
    sepia: "sepia(100%)",
    brightness: "brightness(150%)",
    contrast: "contrast(150%)",
  };

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <div className="insta-form card p-2">
      <h2 className="text-center mb-4">Create Announcement</h2>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <textarea
            className="form-control"
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="3"
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        {imagePreview && (
          <div className="mb-3">
            <img
              src={imagePreview}
              alt="Preview"
              className="insta-image"
              style={{ filter: filterStyles[filter], maxWidth: "100%" }}
            />
            <select
              className="form-select mt-2"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="none">No Filter</option>
              <option value="grayscale">Grayscale</option>
              <option value="sepia">Sepia</option>
              <option value="brightness">Brightness</option>
              <option value="contrast">Contrast</option>
            </select>
          </div>
        )}
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          Post Announcement
        </button>
      </form>
    </div>
  );
}

export default AnnouncementForm;