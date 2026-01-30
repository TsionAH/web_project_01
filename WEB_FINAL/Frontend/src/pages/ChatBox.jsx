import React, { useEffect, useRef, useState } from 'react'
import { dummyMessagesData, dummyUserData } from '../assets/assets'
import { ImageIcon, SendHorizontal } from 'lucide-react'
import './ChatBox.css'

function ChatBox() {
  const [messages, setMessages] = useState(dummyMessagesData)
  const [text, setText] = useState('')
  const [image, setImage] = useState(null)
  const user = dummyUserData
  const messagesEndRef = useRef(null)

  // auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const SendMessage = () => {
    if (!text && !image) return

    const newMessage = {
      id: Date.now(),
      senderId: user.id,
      text,
      message_type: image ? 'image' : 'text',
      media_url: image ? URL.createObjectURL(image) : null,
      createdAt: new Date().toISOString()
    }

    setMessages(prev => [...prev, newMessage])
    setText('')
    setImage(null)
  }

  return (
    <div className="chatbox">
      
      {/* Header */}
      <div className="chat-header">
        <img src={user.profile_picture} alt="user" />
        <div>
          <p className="chat-name">{user.full_name}</p>
          <span className="chat-username">@{user.username}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages
          .slice()
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          .map((msg) => (
            <div
              key={msg.id}
              className={`chat-message ${
                msg.senderId === user.id ? 'sent' : 'received'
              }`}
            >
              {msg.message_type === 'image' && (
                <img src={msg.media_url} alt="sent" />
              )}
              {msg.text && <p>{msg.text}</p>}
            </div>
          ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && SendMessage()}
        />

        <label className="image-upload">
          {image ? (
            <img src={URL.createObjectURL(image)} alt="preview" />
          ) : (
            <ImageIcon size={20} />
          )}
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>

        <button onClick={SendMessage}>
          <SendHorizontal size={18} />
        </button>
      </div>
    </div>
  )
}

export default ChatBox
