import React from 'react'
import { MapPin, MessageCircle, Plus, UserPlus } from 'lucide-react'
import { dummyConnectionsData } from '../assets/assets'
import './UserCard.css'

function UserCard({ user }) {
  const currentUser = dummyConnectionsData

  const handleFollow = async () => {
    // backend later
  }

  const handleConnectionRequest = async () => {
    // backend later
  }

  const isFollowing = currentUser?.following?.includes(user._id)
  const isConnected = currentUser?.connections?.includes(user._id)

  return (
    <div className="user-card">
      {/* User Info */}
      <div className="user-card-header">
        <img
          src={user.profile_picture}
          alt="profile"
          className="user-avatar"
        />

        <div className="user-info">
          <h3 className="user-name">{user.full_name}</h3>
          {user.username && (
            <p className="user-username">@{user.username}</p>
          )}
          {user.bio && <p className="user-bio">{user.bio}</p>}
        </div>
      </div>

      {/* Meta */}
      <div className="user-meta">
        {user.location && (
          <span>
            <MapPin size={14} /> {user.location}
          </span>
        )}
        <span>
          <b>{user.followers?.length || 0}</b> followers
        </span>
      </div>

      {/* Actions */}
      <div className="user-actions">
        <button
          className="follow-btn"
          disabled={isFollowing}
          onClick={handleFollow}
        >
          <UserPlus size={16} />
          {isFollowing ? 'Following' : 'Follow'}
        </button>

        <button
          className="connect-btn"
          onClick={handleConnectionRequest}
        >
          {isConnected ? <MessageCircle size={16} /> : <Plus size={16} />}
        </button>
      </div>
    </div>
  )
}

export default UserCard
