import React, { useState } from 'react'
import SideBar from '../components/SideBar'
import { Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { dummyUserData } from '../assets/assets'
import Loading from '../components/Loading'
import './Layout.css'

function Layout() {
  const user = dummyUserData
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  return user ? (
    <div className="layout-container">
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Outlet />
      </div>
      
      <button 
        className="sidebar-toggle-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? (
          <X className="toggle-icon" />
        ) : (
          <Menu className="toggle-icon" />
        )}
      </button>
    </div>
  ) : (
    <Loading />
  )
}

export default Layout