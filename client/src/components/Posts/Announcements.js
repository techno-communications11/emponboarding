import React, { useEffect, useState } from "react";
import './Styles/Announcement.css';
import { SlDislike, SlLike } from "react-icons/sl";
import { jwtDecode } from "jwt-decode";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const userid = token ? jwtDecode(token)?.id : null;

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getannouncement`);
      if (!response.ok) throw new Error("Failed to fetch announcements");
      const data = await response.json();
      
      const enrichedData = data.map((ann) => ({
        ...ann,
        likes: ann.likes || 0,
        comments: ann.comments || [],
        shares: ann.shares || 0,
        newComment: "",
        liked: false,
        disliked: false,
        shared: false,
      }));
      setAnnouncements(enrichedData);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      setError("Failed to load announcements.");
    } finally {
      setLoading(false);
    }
  };

  const updateAnnouncement = (id, changes) => {
    setAnnouncements((prev) => prev.map((ann) => (ann.id === id ? { ...ann, ...changes } : ann)));
  };

  const handleLike = async (id) => {
    if (!userid) return;
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/likeannouncement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, userid }),
      });
      if (!response.ok) throw new Error("Failed to like announcement");
      updateAnnouncement(id, { 
        liked: true, 
        disliked: false, 
        likes: Number(announcements.find(a => parseInt(a.id) === id)?.likes || 0) + 1 
      });
      
    } catch (error) {
      console.error("Error liking announcement:", error);
    }
  };

  const handleDisLike = async (id) => {
    if (!userid) return;
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/dislikeannouncement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, userid }),
      });
      if (!response.ok) throw new Error("Failed to dislike announcement");
      updateAnnouncement(id, { disliked: true, liked: false, likes: announcements.find(a => a.id === id).likes - 1 });
    } catch (error) {
      console.error("Error disliking announcement:", error);
    }
  };

  const handleCommentChange = (id, value) => {
    updateAnnouncement(id, { newComment: value });
  };

  const handleAddComment = async (id) => {
    if (!userid) return;
    const announcement = announcements.find((ann) => ann.id === id);
    const comment = announcement?.newComment.trim();
    if (!comment) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/addcomment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, comment, userid }),
      });
      if (!response.ok) throw new Error("Failed to add comment");
      updateAnnouncement(id, { comments: [...announcement.comments, { username: "You", comment, created_at: new Date().toISOString() }], newComment: "" });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // const handleShare = async (id) => {
  //   try {
  //     const shareUrl = `${window.location.origin}/announcement/${id}`;
  //     await navigator.clipboard.writeText(shareUrl);
      
  //     const response = await fetch(`${process.env.REACT_APP_BASE_URL}/shareannouncement`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ id }),
  //     });
  //     if (!response.ok) throw new Error("Failed to share announcement");
  //     updateAnnouncement(id, { shared: true, shares: announcements.find(a => a.id === id).shares + 1 });
  //     alert("Link copied to clipboard!");
  //   } catch (error) {
  //     console.error("Error sharing announcement:", error);
  //   }
  // };

  return (
    <div className="container">
      {loading ? (
        <div className="text-center"><div className="spinner-border" role="status"></div></div>
      ) : error ? (
        <div className="text-danger text-center">{error}</div>
      ) : (
        announcements.map((a) => (
          <div key={a.id} className="insta-post">
            <div className="insta-header">
              <div className="insta-profile-pic text-capitalize text-white">{a.username[0]}</div>
              <span className="insta-username text-capitalize"> {a.username}</span>
            </div>
            {a.image_url && <img src={a.image_url} alt="announcement" className="insta-image" />}
            <div className="insta-caption"><strong>{a.title}</strong> {a.content}</div>
            <div className="insta-actions">
              <button onClick={() => handleLike(a.id)} disabled={a.liked}><SlLike /></button>
              <button onClick={() => handleDisLike(a.id)} disabled={a.disliked}><SlDislike /></button>
              {/* <button onClick={() => handleShare(a.id)} disabled={a.shared}><FaShare /></button> */}
              <span className="text-end">Created at: {a.created_at.slice(0, 10)}</span>
            </div>
            <div className="insta-likes">{a.likes} likes</div>
            <div className="insta-comments">
              {a.comments.map((comment, index) => (
                <div key={index}><strong>{comment.username}:</strong> {comment.comment} <span className="text-muted">({comment.created_at.slice(0, 10)})</span></div>
              ))}
            </div>
            <div className="insta-comment-input">
              <input type="text" placeholder="Add a comment..." value={a.newComment} onChange={(e) => handleCommentChange(a.id, e.target.value)} />
              <button onClick={() => handleAddComment(a.id)}>Post</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Announcements;
