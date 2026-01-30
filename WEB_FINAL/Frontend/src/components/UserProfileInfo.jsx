import React from 'react'
import moment from 'moment'
import { Calendar, MapPin, PenBox, Verified } from 'lucide-react'
import './UserProfileInfo.css' 

const UserProfileInfo = ({ user, posts, profileId, setShowEdit }) => {
  return (
    <div className="user-profile-info">

      {/* Cover Photo */}
      <div className="cover-section">
        <img
          src={user?.cover_photo}
          alt="Cover"
          className="cover-photo"
        />
      </div>

      {/* Profile Picture */}
      <div className="profile-picture-section">
        <img
          src={user?.profile_picture}
          alt={`${user?.full_name}'s profile`}
          className="profile-picture"
        />
        {!profileId && (
          <button className="edit-profile-btn" onClick={() => setShowEdit(true)}>
            <PenBox size={14} />
          </button>
        )}
      </div>

      {/* Profile Info */}
      <div className="profile-info">
        <h2>{user?.full_name}</h2>
        <p className="username">@{user?.username || 'Add username'}</p>
        <p className="bio">{user?.bio || 'Add a bio'}</p>
      </div>

      {/* Meta Info */}
      <div className="profile-meta">
        <span>
          <MapPin size={16} />
          {user?.location || 'Add location'}
        </span>
        <span>
          <Calendar size={16} />
          Joined {moment(user?.createdAt).fromNow()}
        </span>
      </div>

      {/* Stats */}
      <div className="profile-stats">
        <div>
          <span className="count">{posts?.length || 0}</span>
          <span>Posts</span>
        </div>
        <div>
          <span className="count">{user?.followers?.length || 0}</span>
          <span>Followers</span>
        </div>
        <div>
          <span className="count">{user?.following?.length || 0}</span>
          <span>Following</span>
        </div>
      </div>

    </div>
  )
}

export default UserProfileInfo
