import React from 'react'
import { dummyConnectionsData } from '../assets/assets'
import { Eye, MessageSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './Messages.css'

function Messages() {
  const navigate = useNavigate()

  return (
    <div className="messages-container">
      {/* HEADER */}
      <div className="messages-header">
        <h1>Messages</h1>
        <p>Talk to students and your friends</p>
      </div>

      {/* USERS LIST */}
      <div className="messages-list">
        {dummyConnectionsData.map((user) => (
          <div className="message-card" key={user._id}>
            <img className="user-avatar" src={user.profile_picture} alt={user.full_name} />

            <div className="user-info">
              <p className="user-name">{user.full_name}</p>
              <p className="user-bio">{user.bio}</p>
            </div>

            <div className="message-actions">
              <button onClick={() => navigate(`/messages/${user._id}`)}>
                <MessageSquare size={18} />
              </button>
              <button onClick={() => navigate(`/profile/${user._id}`)}>
                <Eye size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Messages
