import React, { useState } from 'react'
import { dummyConnectionsData } from '../assets/assets'
import { Search } from 'lucide-react'
import UserCard from '../components/UserCard'
import './Discover.css'

function Discover() {
  const [input, setInput] = useState('')
  const [users, setUsers] = useState(dummyConnectionsData)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      setUsers([])
      setLoading(true)
      // Simulate API search
      setTimeout(() => {
        const filtered = dummyConnectionsData.filter(user =>
          user.full_name.toLowerCase().includes(input.toLowerCase())
        )
        setUsers(filtered)
        setLoading(false)
      }, 1000)
    }
  }

  return (
    <div className="discover-container">
      {/* HEADER */}
      <div className="discover-header">
        <h1>Discover AAU Students</h1>
        <p>Connect with amazing students and learn from their journey</p>
      </div>

      {/* SEARCH */}
      <div className="discover-search">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search students..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={handleSearch}
        />
      </div>

      {/* USERS LIST */}
      <div className="users-list">
        {users.map((user) => (
          <UserCard user={user} key={user._id} />
        ))}
        {loading && <p className="loading">Searching...</p>}
      </div>
    </div>
  )
}

export default Discover
