import { BadgeCheck, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import './StoryViewer.css'

function StoryViewer({ viewStory, setViewStory }) {
    const [progress, setProgress] = useState(0)
    
    useEffect(() => {
        let timer, progressInterval
        
        if (viewStory && viewStory.media_type !== 'video') {
            setProgress(0)
            const duration = 5000 // 5 seconds for text/images
            const stepTime = 50
            let elapsed = 0
            
            progressInterval = setInterval(() => {
                elapsed += stepTime
                setProgress((elapsed / duration) * 100)
            }, stepTime)
            
            timer = setTimeout(() => {
                setViewStory(null)
            }, duration)
            
            return () => {
                clearTimeout(timer)
                clearInterval(progressInterval)
            }
        }
    }, [viewStory, setViewStory])
    
    const handleClose = () => {
        setViewStory(null)
    }
    
    const renderContent = () => {
        if (!viewStory) return null
        
        switch (viewStory.media_type) {
            case 'image':
                return (
                    <img 
                        src={viewStory.media_url} 
                        alt="Story" 
                        className="story-viewer-image"
                    />
                )
            case 'video':
                return (
                    <video 
                        className="story-viewer-video"
                        controls
                        autoPlay
                        onEnded={() => setViewStory(null)}
                        src={viewStory.media_url}
                    />
                )
            case 'text':
                return (
                    <div className="story-viewer-text">
                        {viewStory.content}
                    </div>
                )
            default:
                return null
        }
    }
    
    return (
        <div 
            className="story-viewer-overlay"
            style={{ backgroundColor: viewStory?.media_type === 'text' ? viewStory.background_color : 'rgba(0, 0, 0, 0.9)' }}
        >
            {/* Progress Bar */}
            <div className="progress-bar-container">
                <div 
                    className="progress-bar"
                    style={{ width: `${progress}%` }}
                />
            </div>
            
            {/* User Info */}
            <div className="viewer-user-info">
                <img 
                    src={viewStory?.user?.profile_picture} 
                    alt={viewStory?.user?.full_name}
                    className="viewer-user-avatar"
                />
                <div className="viewer-user-details">
                    <span className="viewer-username">
                        {viewStory?.user?.full_name}
                    </span>
                    <BadgeCheck className="verified-badge" size={18} />
                </div>
            </div>
            
            {/* Close Button */}
            <button className="close-viewer-button" onClick={handleClose}>
                <X className="close-icon" />
            </button>
            
            {/* Content Wrapper */}
            <div className="viewer-content">
                {renderContent()}
            </div>
        </div>
    )
}

export default StoryViewer