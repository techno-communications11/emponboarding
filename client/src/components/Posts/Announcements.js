import React, { useEffect, useState } from "react";
import "./Styles/Announcement.css";
import { SlDislike, SlLike } from "react-icons/sl";
import { useNavigate } from "react-router-dom";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
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
        setUserId(data.id);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error.message);
        navigate("/"); // Redirect to login if not authenticated
      }
    };
    fetchUserData();
  }, [navigate]);

  // Fetch announcements once user data is available
  useEffect(() => {
    if (!userId) return; // Wait for userId

    const fetchAnnouncements = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getannouncement`, {
          method: "GET",
          credentials: "include", // Send HTTP-only cookie
        });
        if (!response.ok) throw new Error("Failed to fetch announcements");
        const data = await response.json();

        const enrichedData = data.map((ann) => ({
          ...ann,
          likes: ann.likes || 0,
          comments: ann.comments || [],
          shares: ann.shares || 0,
          newComment: "",
          liked: false, // Could fetch user-specific likes from backend
          disliked: false, // Could fetch user-specific dislikes from backend
          shared: false,
        }));
        setAnnouncements(enrichedData);
      } catch (error) {
        console.error("Error fetching announcements:", error);
        setError("Failed to load announcements: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [userId]);

  const updateAnnouncement = (id, changes) => {
    setAnnouncements((prev) =>
      prev.map((ann) => (ann.id === id ? { ...ann, ...changes } : ann))
    );
  };

  const handleLike = async (id) => {
    if (!userId) {
      setError("Please log in to like announcements.");
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/likeannouncement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Send HTTP-only cookie
        body: JSON.stringify({ id, userid: userId }),
      });
      if (!response.ok) throw new Error("Failed to like announcement");
      const currentAnn = announcements.find((a) => parseInt(a.id) === id);
      updateAnnouncement(id, {
        liked: true,
        disliked: false,
        likes: Number(currentAnn.likes || 0) + (currentAnn.liked ? 0 : 1),
      });
    } catch (error) {
      console.error("Error liking announcement:", error);
      setError(error.message);
    }
  };

  const handleDisLike = async (id) => {
    if (!userId) {
      setError("Please log in to dislike announcements.");
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/dislikeannouncement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Send HTTP-only cookie
        body: JSON.stringify({ id, userid: userId }),
      });
      if (!response.ok) throw new Error("Failed to dislike announcement");
      const currentAnn = announcements.find((a) => parseInt(a.id) === id);
      updateAnnouncement(id, {
        disliked: true,
        liked: false,
        likes: Number(currentAnn.likes || 0) - (currentAnn.disliked ? 0 : 1),
      });
    } catch (error) {
      console.error("Error disliking announcement:", error);
      setError(error.message);
    }
  };

  const handleCommentChange = (id, value) => {
    updateAnnouncement(id, { newComment: value });
  };

  const handleAddComment = async (id) => {
    if (!userId) {
      setError("Please log in to comment.");
      return;
    }
    const announcement = announcements.find((ann) => ann.id === id);
    const comment = announcement?.newComment.trim();
    if (!comment) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/addcomment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Send HTTP-only cookie
        body: JSON.stringify({ id, comment, userid: userId }),
      });
      if (!response.ok) throw new Error("Failed to add comment");
      const responseData = await response.json();
      updateAnnouncement(id, {
        comments: [
          ...announcement.comments,
          { username: responseData.username || "You", comment, created_at: new Date().toISOString() },
        ],
        newComment: "",
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-danger text-center p-5">{error}</div>;
  }

  return (
    <div className="container">
      {announcements.length === 0 ? (
        <div className="text-center p-5">No announcements available.</div>
      ) : (
        announcements.map((a) => (
          <div key={a.id} className="insta-post">
            <div className="insta-header">
              <div className="insta-profile-pic text-capitalize text-white">{a.username[0]}</div>
              <span className="insta-username text-capitalize"> {a.username}</span>
            </div>
            {a.image_url && <img src={a.image_url} alt="announcement" className="insta-image" />}
            <div className="insta-caption">
              <strong>{a.title}</strong> {a.content}
            </div>
            <div className="insta-actions">
              <button onClick={() => handleLike(a.id)} disabled={a.liked}>
                <SlLike /> {a.liked ? "Liked" : "Like"}
              </button>
              <button onClick={() => handleDisLike(a.id)} disabled={a.disliked}>
                <SlDislike /> {a.disliked ? "Disliked" : "Dislike"}
              </button>
              <span className="text-end">Created at: {a.created_at.slice(0, 10)}</span>
            </div>
            <div className="insta-likes">{a.likes} likes</div>
            <div className="insta-comments">
              {a.comments.map((comment, index) => (
                <div key={index}>
                  <strong>{comment.username}:</strong> {comment.comment}{" "}
                  <span className="text-muted">({comment.created_at.slice(0, 10)})</span>
                </div>
              ))}
            </div>
            <div className="insta-comment-input">
              <input
                type="text"
                placeholder="Add a comment..."
                value={a.newComment}
                onChange={(e) => handleCommentChange(a.id, e.target.value)}
              />
              <button onClick={() => handleAddComment(a.id)}>Post</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Announcements;