import React, { useEffect, useState } from 'react'
import { assets, dummyPostsData, dummyMessagesData } from '../assets/assets'
import Loading from '../components/Loading'
import StoriesBar from '../components/StoriesBar'
import PostCard from '../components/PostCard'
import RecentMessages from '../components/RecentMessages'
import './Feed.css'

function Feed() {
  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [recentMessages, setRecentMessages] = useState([])

  // Fetch posts (dummy for now)
  const fetchFeeds = async () => {
    setFeeds(dummyPostsData)
    setLoading(false)
  }

  // Fetch recent messages (dummy for now)
  const fetchRecentMessages = async () => {
    setRecentMessages(dummyMessagesData)
  }

  useEffect(() => {
    fetchFeeds()
    fetchRecentMessages()
  }, [])

  if (loading) return <Loading />

  return (
    <div className="feed-container">
      
      {/* MAIN FEED */}
      <div className="feed-main">

        {/* STORIES */}
        <div className="stories-section">
          <StoriesBar />
        </div>

        {/* POSTS */}
        <div className="posts-section">
          <div className="posts-header">
            <h2 className="posts-title">Posts</h2>
            <div className="posts-filter">
              <span className="filter-active">Latest</span>
              <span>Popular</span>
              <span>Following</span>
            </div>
          </div>

          <div className="posts-list">
            {feeds.length > 0 ? (
              feeds.map((post) => <PostCard key={post._id} post={post} />)
            ) : (
              <div className="no-posts">
                <p>No posts yet. Be the first to post!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="right-sidebar">

        {/* Recent Messages */}
        <div className="sidebar-card">
          <h3 className="sidebar-title">Recent Messages</h3>
          <RecentMessages messages={recentMessages} />
        </div>

        {/* Trending */}
        <div className="sidebar-card">
          <h3 className="sidebar-title">Trending</h3>
          <img src={assets.sponsored_img} alt="Trending" className="trending-img" />
          <p className="trending-placeholder">
            Trending topics will appear here
          </p>
        </div>

      </div>
    </div>
  )
}

export default Feed
