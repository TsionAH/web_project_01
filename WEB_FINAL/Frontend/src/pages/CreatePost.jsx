import React, { useState } from 'react'
import { dummyUserData } from '../assets/assets'
import { X, Image } from 'lucide-react'
import toast from 'react-hot-toast'
import './CreatePost.css'

function CreatePost() {
  const [content, setContent] = useState('')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)

  const user = dummyUserData

  const handleSubmit = async () => {
    if (!content && images.length === 0) {
      toast.error('Add text or image to post')
      return
    }

    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setContent('')
      setImages([])
      toast.success('Post published!')
    } catch (err) {
      toast.error('Failed to post')
    } finally {
      setLoading(false)
    }
  }

  const handleImageRemove = (index) => {
    setImages(images.filter((_, i) => i !== index))
  }

  return (
    <div className="create-post-container">
      {/* HEADER */}
      <div className="create-post-header">
        <h1>Create Post</h1>
        <p>Share your posts here</p>
      </div>

      {/* USER INFO */}
      <div className="user-info">
        <img src={user.profile_picture} alt={user.full_name} />
        <div>
          <h2>{user.full_name}</h2>
          <p>@{user.username}</p>
        </div>
      </div>

      {/* TEXTAREA */}
      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* IMAGE PREVIEW */}
      {images.length > 0 && (
        <div className="images-preview">
          {images.map((image, i) => (
            <div className="image-wrapper" key={i}>
              <img src={URL.createObjectURL(image)} alt={`preview-${i}`} />
              <div className="remove-image" onClick={() => handleImageRemove(i)}>
                <X size={16} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BOTTOM BAR */}
      <div className="create-post-bottom">
        <label className="image-upload">
          <Image size={20} />
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => setImages([...images, ...e.target.files])}
          />
        </label>
        <button
          disabled={loading}
          onClick={() =>
            toast.promise(handleSubmit(), {
              loading: 'Uploading...',
              success: 'Post added!',
              error: 'Post not added',
            })
          }
        >
          Publish Post
        </button>
      </div>
    </div>
  )
}

export default CreatePost
