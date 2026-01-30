import React from 'react'
import { assets, dummyUserData } from '../assets/assets'
import MenuItems from './MenuItems'
import './SidBar.css'
import { Link, useNavigate } from 'react-router-dom'
import { CirclePlus, LogOut } from 'lucide-react'
import { UserButton, useClerk } from '@clerk/clerk-react'

function SideBar({ sidebarOpen, setSidebarOpen }) {
    const navigate = useNavigate()
    const user = dummyUserData
    const { signOut } = useClerk()
    
    const handleLogout = async () => {
        try {
            await signOut()
            navigate('/')
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    return (
        <div className={`sidebar-container ${sidebarOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-content">
                <div className="sidebar-header">
                    <img src={assets.logo} alt="AAU Social Logo" className="sidebar-logo" />
                    <hr className="sidebar-divider" />
                </div>
                
                <MenuItems setSidebarOpen={setSidebarOpen} />
                
                <Link to="/create-post" className="create-post-btn" onClick={() => setSidebarOpen(false)}>
                    <CirclePlus className="create-post-icon" />
                    <span>Create Post</span>
                </Link>
                
                <div className="user-profile-section">
                    <div className="user-info">
                        <UserButton className="user-button" />
                        <div className="user-details">
                            <div className="user-fullname">{user.full_name}</div>
                            <p className="user-username">@{user.username}</p>
                        </div>
                    </div>
                    
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut className="logout-icon" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SideBar