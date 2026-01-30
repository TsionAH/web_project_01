import React, { useState } from 'react'
import { BadgeCheck, Heart, MessageCircle, Share } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { dummyUserData } from '../assets/assets'
import './PostCard.css'

function PostCard({ post }) {
  const navigate = useNavigate()
  const currentUser = dummyUserData

  const [likes, setLikes] = useState(post.likes || [])

  const postWithHashtags = post.content?.replace(
    /(#\w+)/g,
    '<span class="hashtag">$1</span>'
  )

  const handleLike = () => {
    // leave empty for now
  }

  return (
    <div className="post-card">
      {/* HEADER */}
      <div
        className="post-header"
        onClick={() => navigate(`/profile/${post.user._id}`)}
      >
        <img
          src={post.user.profile_picture}
          alt="user"
          className="post-avatar"
        />

        <div className="post-user-info">
          <div className="post-name">
            <span>{post.user.full_name}</span>
            <BadgeCheck size={16} className="verified-icon" />
          </div>
          <span className="post-username">
            @{post.user.username} · {moment(post.createdAt).fromNow()}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      {post.content && (
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: postWithHashtags }}
        />
      )}

      {/* IMAGES */}
      {post.image_urls?.length > 0 && (
        <div className="post-images">
          {post.image_urls.map((img, index) => (
            <img src={img} key={index} alt="post" />
          ))}
        </div>
      )}

      {/* ACTIONS */}
      <div className="post-actions">
        <button className="action-btn" onClick={handleLike}>
          <Heart />
          <span>{likes.length}</span>
        </button>

        <button className="action-btn">
          <MessageCircle />
          <span>12</span>
        </button>

        <button className="action-btn">
          <Share />
        </button>
      </div>
    </div>
  )
}

export default PostCard
