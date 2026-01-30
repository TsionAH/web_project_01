import React, { useState } from 'react'
import { dummyUserData } from '../assets/assets'
import { Pencil } from 'lucide-react'
import './ProfileModel.css'

function ProfileModel({ setShowEdit }) {
  const user = dummyUserData

  const [editForm, setEditForm] = useState({
    username: user.username,
    bio: user.bio,
    location: user.location,
    profile_picture: null,
    cover_photo: null,
    full_name: user.full_name,
  })

  const handleSaveProfile = (e) => {
    e.preventDefault()
    console.log('Updated profile:', editForm)
    setShowEdit(false)
  }

  return (
    <div className="profile-model-overlay">
      <div className="profile-model">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSaveProfile} className="profile-form">

          {/* Cover Photo */}
          <div className="form-group cover-section">
            <label>Cover Photo</label>
            <div className="image-preview cover">
              <img
                src={editForm.cover_photo ? URL.createObjectURL(editForm.cover_photo) : user.cover_photo}
                alt="Cover Preview"
              />
              <Pencil className="edit-icon" />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditForm({ ...editForm, cover_photo: e.target.files[0] })}
            />
          </div>

          {/* Profile Picture */}
          <div className="form-group profile-picture-section">
            <label>Profile Picture</label>
            <div className="image-preview">
              <img
                src={editForm.profile_picture ? URL.createObjectURL(editForm.profile_picture) : user.profile_picture}
                alt="Profile Preview"
              />
              <Pencil className="edit-icon" />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditForm({ ...editForm, profile_picture: e.target.files[0] })}
            />
          </div>

          {/* Name */}
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={editForm.full_name}
              onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
            />
          </div>

          {/* Username */}
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={editForm.username}
              onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
            />
          </div>

          {/* Bio */}
          <div className="form-group">
            <label>Bio</label>
            <textarea
              rows={3}
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
            />
          </div>

          {/* Location */}
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={editForm.location}
              onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
            />
          </div>

          {/* Buttons */}
          <div className="profile-actions">
            <button type="button" className="cancel-btn" onClick={() => setShowEdit(false)}>
              Cancel
            </button>
            <button type="submit" className="save-btn">Save Changes</button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default ProfileModel
