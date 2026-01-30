import { ArrowLeft, Sparkle, TextIcon, Upload } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import './StoryModel.css'

function StoryModel({ setShowModal, fetchStory }) {
    const bgColors = ["#667eea", "#764ba2", "#f56565", "#48bb78", "#ed8936", "#4299e1"]
    const [mode, setMode] = useState("text")
    const [background, setBackground] = useState(bgColors[0])
    const [text, setText] = useState("")
    const [media, setMedia] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    
    const handleMediaUpload = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setMedia(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
    }
    
    const handleCreateStory = async () => {
        // Story creation logic here
        return new Promise(resolve => setTimeout(resolve, 1500))
    }
    
    const createStory = () => {
        toast.promise(handleCreateStory(), {
            loading: 'Creating story...',
            success: 'Story added successfully!',
            error: 'Failed to create story'
        }).then(() => {
            setShowModal(false)
            fetchStory()
        })
    }
    
    return (
        <div className="story-model-overlay">
            <div className="story-model">
                <div className="model-header">
                    <button 
                        className="back-button"
                        onClick={() => setShowModal(false)}
                    >
                        <ArrowLeft className="back-icon" />
                    </button>
                    <h2 className="model-title">Create Story</h2>
                </div>
                
                <div 
                    className="story-preview" 
                    style={{ backgroundColor: background }}
                >
                    {mode === 'text' && (
                        <textarea 
                            className="story-textarea"
                            placeholder="What's on your mind?" 
                            onChange={(e) => setText(e.target.value)} 
                            value={text}
                            autoFocus
                        />
                    )}
                    {mode === 'media' && previewUrl && (
                        media?.type.startsWith('image') ? (
                            <img 
                                src={previewUrl} 
                                alt="Preview" 
                                className="media-preview"
                            />
                        ) : (
                            <video 
                                src={previewUrl} 
                                className="media-preview"
                                controls
                            />
                        )
                    )}
                </div>
                
                <div className="color-picker">
                    <p className="color-picker-label">Background Color</p>
                    <div className="color-options">
                        {bgColors.map((color, index) => (
                            <button 
                                key={index}
                                className={`color-option ${background === color ? 'selected' : ''}`}
                                style={{ backgroundColor: color }}
                                onClick={() => {
                                    setBackground(color)
                                    setMode('text')
                                }}
                            />
                        ))}
                    </div>
                </div>
                
                <div className="mode-selector">
                    <button 
                        className={`mode-button ${mode === 'text' ? 'active' : ''}`}
                        onClick={() => {
                            setMode('text')
                            setMedia(null)
                            setPreviewUrl(null)
                        }}
                    >
                        <TextIcon className="mode-icon" />
                        <span>Text</span>
                    </button>
                    
                    <label className="mode-button upload-button">
                        <input 
                            className="file-input"
                            onChange={(e) => {
                                handleMediaUpload(e)
                                setMode('media')
                            }} 
                            type="file" 
                            accept="image/*, video/*" 
                        />
                        <Upload className="mode-icon" />
                        <span>Upload</span>
                    </label>
                </div>
                
                <div className="action-buttons">
                    <button 
                        className="create-button"
                        onClick={createStory}
                    >
                        <Sparkle className="sparkle-icon" />
                        <span>Create Story</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default StoryModel