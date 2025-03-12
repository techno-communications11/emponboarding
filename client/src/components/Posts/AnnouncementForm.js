import React from 'react'
import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
function AnnouncementForm() {

    const [title, setTitle] = useState("");
      const [content, setContent] = useState("");
      const [image, setImage] = useState(null);
      const [imagePreview, setImagePreview] = useState(null);
      const [filter, setFilter] = useState("none");
      
      const [error, setError] = useState(null);
      const token=localStorage.getItem('token');
      let userid;
      if(token){
userid=jwtDecode(token);
      }




      const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const formData = new FormData();
        formData.append("admin_id", userid);
        formData.append("title", title);
        formData.append("content", content);
        formData.append("image", image);
    
        try {
          await fetch(`${process.env.REACT_APP_BASE_URL}/createannouncement`, {
            method: "POST",
            body: formData,
          });
          setTitle("");
          setContent("");
          setImage(null);
          setImagePreview(null);
          setFilter("none");
          
        } catch (error) {
          console.error("Error posting announcement:", error);
          setError("Failed to post announcement.");
        }
      };
    
    
    
      const filterStyles = {
        none: "none",
        grayscale: "grayscale(100%)",
        sepia: "sepia(100%)",
        brightness: "brightness(150%)",
        contrast: "contrast(150%)",
      };
    
  return (
    <div className="insta-form">
    <h2 className="text-center mb-4">Create Announcement</h2>
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
          onChange={handleImageChange}
        //   required
        />
      </div>
      {imagePreview && (
        <div className="mb-3">
          <img
            src={imagePreview}
            alt="Preview"
            className="insta-image"
            style={{ filter: filterStyles[filter] }}
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
      <button type="submit" className="btn btn-primary w-100">
        Post Announcement
      </button>
    </form>
  </div>
  )
}

export default AnnouncementForm
