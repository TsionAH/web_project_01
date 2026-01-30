import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { dummyRecentMessagesData } from '../assets/assets'
import './RecentMessages.css'

function RecentMessages() {
  const [messages, setMessages] = useState([])

  const fetchRecentMessages = async () => {
    setMessages(dummyRecentMessagesData)
  }

  useEffect(() => {
    fetchRecentMessages()
  }, [])

  return (
    <div className="recent-messages">
      <h3 className="recent-title">Recent Messages</h3>

      {messages.length === 0 ? (
        <p className="no-messages">No recent messages</p>
      ) : (
        <div className="messages-list">
          {messages.map((message, index) => (
            <Link
              to={`/messages/${message.from_user_id._id}`}
              key={index}
              className="message-item"
            >
              <img
                src={message.from_user_id.profile_picture}
                alt="profile"
                className="message-avatar"
              />

              <div className="message-content">
                <div className="message-header">
                  <p className="message-name">
                    {message.from_user_id.full_name}
                  </p>
                  <span className="message-time">
                    {moment(message.createdAt).fromNow()}
                  </span>
                </div>

                <p className="message-text">
                  {message.text ? message.text : '📎 Media'}
                </p>
              </div>

              {!message.seen && <span className="unread-dot" />}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default RecentMessages
