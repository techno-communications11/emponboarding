import React, { useEffect, useState } from "react";
import './Styles/Announcement.css';
import { SlDislike, SlLike } from "react-icons/sl";
import { FaShare } from "react-icons/fa";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getannouncement`);
      const data = await response.json();
      const enrichedData = data.map((ann) => ({
        ...ann,
        likes: ann.likes || 0, // Assume server provides initial likes
        comments: ann.comments || [], // Assume server provides initial comments
        shares: ann.shares || 0, // Assume server provides initial shares
        newComment: "",
        liked: false,
        disliked: false,
        shared: false, // Track if user has shared
      }));
      setAnnouncements(enrichedData);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      setError("Failed to load announcements.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/likeannouncement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        setAnnouncements((prev) =>
          prev.map((ann) => {
            if (ann.id === id && !ann.liked && !ann.disliked) {
              return { ...ann, likes: ann.likes + 1, liked: true };
            }
            return ann;
          })
        );
      } else {
        throw new Error("Failed to like announcement");
      }
    } catch (error) {
      console.error("Error liking announcement:", error);
      setError("Failed to like announcement.");
    }
  };

  const handleDisLike = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/dislikeannouncement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        setAnnouncements((prev) =>
          prev.map((ann) => {
            if (ann.id === id && !ann.disliked && !ann.liked) {
              return { ...ann, likes: ann.likes - 1, disliked: true };
            }
            return ann;
          })
        );
      } else {
        throw new Error("Failed to dislike announcement");
      }
    } catch (error) {
      console.error("Error disliking announcement:", error);
      setError("Failed to dislike announcement.");
    }
  };

  const handleCommentChange = (id, value) => {
    setAnnouncements((prev) =>
      prev.map((ann) =>
        ann.id === id ? { ...ann, newComment: value } : ann
      )
    );
  };

  const handleAddComment = async (id) => {
    const announcement = announcements.find((ann) => ann.id === id);
    const comment = announcement.newComment.trim();
    if (!comment) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/addcomment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, comment }),
      });
      if (response.ok) {
        setAnnouncements((prev) =>
          prev.map((ann) => {
            if (ann.id === id) {
              return {
                ...ann,
                comments: [...ann.comments, comment],
                newComment: "",
              };
            }
            return ann;
          })
        );
      } else {
        throw new Error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Failed to add comment.");
    }
  };

  const handleShare = async (id) => {
    try {
      const shareUrl = `${window.location.origin}/announcement/${id}`;
      await navigator.clipboard.writeText(shareUrl); // Copy link to clipboard

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/shareannouncement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        setAnnouncements((prev) =>
          prev.map((ann) => {
            if (ann.id === id && !ann.shared) {
              return { ...ann, shares: ann.shares + 1, shared: true };
            }
            return ann;
          })
        );
        alert("Link copied to clipboard!");
      } else {
        throw new Error("Failed to share announcement");
      }
    } catch (error) {
      console.error("Error sharing announcement:", error);
      setError("Failed to share announcement.");
    }
  };

  return (
    <div className="container my-5">
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status"></div>
        </div>
      ) : error ? (
        <div className="text-danger text-center">{error}</div>
      ) : (
        announcements.map((a) => (
          <div key={a.id} className="insta-post">
            <div className="insta-header">
              <div className="insta-profile-pic">{}</div>
              <span className="insta-username"></span>
            </div>
            {a.image_url && (
              <img src={a.image_url} alt="announcement" className="insta-image" />
            )}
            <div className="insta-caption">
              <strong>{a.title}</strong> {a.content}
            </div>
            <div className="insta-actions">
              <button
                onClick={() => handleLike(a.id)}
                disabled={a.liked || a.disliked}
                className={a.liked ? "liked" : ""}
              >
                <SlLike />
              </button>
              <button
                onClick={() => handleDisLike(a.id)}
                disabled={a.disliked || a.liked}
                className={a.disliked ? "disliked" : ""}
              >
                <SlDislike />
              </button>
              <button
                onClick={() => handleShare(a.id)}
                disabled={a.shared}
                className={a.shared ? "shared" : ""}
              >
                <FaShare />
              </button>
              <span className="text-end">created at: {a.created_at.slice(0, 10)}</span>
            </div>
            <div className="insta-likes">
              {a.likes} likes • {a.shares} shares
            </div>
            <div className="insta-comments">
              {a.comments.map((comment, index) => (
                <div key={index}>
                  <strong>user_{index + 1}</strong> {comment}
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