import React, { useState } from 'react'
import { Users, UserPlus, UserCheck, UserRoundPen, MessageSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  dummyConnectionsData as connections,
  dummyFollowersData as followers,
  dummyFollowingData as following,
  dummyPendingConnectionsData as pendingConnections
} from '../assets/assets'
import './Connections.css'

function Connections() {
  const [currentTab, setCurrentTab] = useState('Followers')
  const navigate = useNavigate()

  const tabs = [
    { label: 'Followers', value: followers, icon: Users },
    { label: 'Following', value: following, icon: UserCheck },
    { label: 'Pending', value: pendingConnections, icon: UserRoundPen },
    { label: 'Connections', value: connections, icon: UserPlus },
  ]

  const currentData = tabs.find(tab => tab.label === currentTab)?.value || []

  return (
    <div className="connections-container">
      {/* HEADER */}
      <div className="connections-header">
        <h1>Connections</h1>
        <p>Manage your network and discover new connections</p>
      </div>

      {/* COUNT CARDS */}
      <div className="connections-counts">
        {tabs.map((tab) => (
          <div key={tab.label} className="count-card">
            <b>{tab.value.length}</b>
            <p>{tab.label}</p>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div className="connections-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={currentTab === tab.label ? 'tab-active' : ''}
            onClick={() => setCurrentTab(tab.label)}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* USERS LIST */}
      <div className="connections-list">
        {currentData.map((user) => (
          <div key={user._id} className="user-card">
            <img src={user.profile_picture} alt={user.full_name} />
            <div className="user-info">
              <p className="user-name">{user.full_name}</p>
              {user.username && <p className="user-username">@{user.username}</p>}
              {user.bio && <p className="user-bio">{user.bio.slice(0, 30)}...</p>}
            </div>
            <div className="user-actions">
              <button onClick={() => navigate(`/profile/${user._id}`)}>View Profile</button>

              {currentTab === 'Following' && <button>Unfollow</button>}
              {currentTab === 'Pending' && (
                <>
                  <button>Pending</button>
                  <button>Accept</button>
                </>
              )}
              {currentTab === 'Connections' && (
                <button onClick={() => navigate(`/messages/${user._id}`)}>
                  <MessageSquare size={16} /> Message
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Connections
