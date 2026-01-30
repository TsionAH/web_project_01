import React, { useEffect, useState } from 'react'
import { dummyStoriesData } from '../assets/assets'
import { Plus } from 'lucide-react'
import moment from 'moment'
import StoryModel from './StoryModel'
import StoryViewer from './StoryViewer'
import './StoriesBar.css'

function StoriesBar() {
    const [stories, setStories] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [viewStory, setViewStory] = useState(null)
    
    const fetchStories = async () => {
        setStories(dummyStoriesData)
    }
    
    useEffect(() => {
        fetchStories()
    }, [])
    
    return (
        <div className="stories-bar">
            {/* Add Story Card */}
            <div 
                className="story-card add-story" 
                onClick={() => setShowModal(true)}
            >
                <div className="add-story-icon">
                    <Plus className="plus-icon" />
                </div>
                <p className="add-story-text">Create Story</p>
            </div>
            
            {/* Story Cards */}
            {stories.map((story, index) => (
                <div 
                    className="story-card" 
                    onClick={() => setViewStory(story)} 
                    key={index}
                >
                    <div className="story-user">
                        <img 
                            src={story.user?.profile_picture} 
                            alt={story.user?.full_name} 
                            className="story-user-avatar"
                        />
                        <div className="story-user-info">
                            <p className="story-username">{story.user?.full_name}</p>
                            <p className="story-time">{moment(story.createdAt).fromNow()}</p>
                        </div>
                    </div>
                    
                    <div className="story-content">
                        {story.media_type !== 'text' && (
                            <div className="story-media-preview">
                                {story.media_type === "image" ? (
                                    <img 
                                        src={story.media_url} 
                                        alt="Story media" 
                                        className="story-image"
                                    />
                                ) : (
                                    <video 
                                        src={story.media_url} 
                                        className="story-video"
                                        muted
                                    />
                                )}
                            </div>
                        )}
                        {story.content && (
                            <p className="story-text">{story.content}</p>
                        )}
                    </div>
                </div>
            ))}
            
            {showModal && (
                <StoryModel 
                    setShowModal={setShowModal} 
                    fetchStory={fetchStories} 
                />
            )}
            
            {viewStory && (
                <StoryViewer 
                    viewStory={viewStory} 
                    setViewStory={setViewStory} 
                />
            )}
        </div>
    )
}

export default StoriesBar