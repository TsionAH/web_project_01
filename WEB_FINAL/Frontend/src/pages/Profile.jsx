import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import moment from 'moment'
import { dummyPostsData, dummyUserData } from '../assets/assets'
import UserProfileInfo from '../components/UserProfileInfo'
import PostCard from '../components/PostCard'
import ProfileModel from '../components/ProfileModel'
import './Profile.css'

function Profile() {
  const { profileId } = useParams()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [activeTab, setActiveTab] = useState('posts')
  const [showEdit, setShowEdit] = useState(false)

  const fetchUser = async () => {
    // Fetch user and posts (here using dummy data)
    setUser(dummyUserData)
    setPosts(dummyPostsData)
  }

  useEffect(() => {
    fetchUser()
  }, [])

  if (!user) return <div className="loading">Loading...</div>

  const tabs = ['posts', 'media', 'likes']

  return (
    <div className="profile-container">
      {/* COVER PHOTO */}
      {user.cover_photo && (
        <div className="profile-cover">
          <img src={user.cover_photo} alt="cover" />
        </div>
      )}

      {/* USER INFO */}
      <UserProfileInfo
        user={user}
        posts={posts}
        profileId={profileId}
        setShowEdit={setShowEdit}
      />

      {/* TABS */}
      <div className="profile-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* POSTS */}
      <div className="profile-posts">
        {activeTab === 'posts' &&
          posts.map((post) => <PostCard key={post._id} post={post} />)}

        {/* MEDIA */}
        {activeTab === 'media' &&
          posts
            .filter((post) => post.image_urls.length > 0)
            .map((post) => (
              <div className="media-post" key={post._id}>
                {post.image_urls.map((image, index) => (
                  <Link to={image} key={index} className="media-image">
                    <img src={image} alt={`post-${index}`} />
                    <p>posted {moment(post.createdAt).fromNow()}</p>
                  </Link>
                ))}
              </div>
            ))}

        {/* LIKES */}
        {activeTab === 'likes' && (
          <div className="profile-likes">
            <p>No liked posts yet</p>
          </div>
        )}
      </div>

      {/* EDIT PROFILE MODAL */}
      {showEdit && <ProfileModel setShowEdit={setShowEdit} />}
    </div>
  )
}

export default Profile
