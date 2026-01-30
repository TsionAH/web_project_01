import React from 'react'
import { menuItemsData } from '../assets/assets'
import { NavLink } from 'react-router-dom'
import './MenuItem.css'

function MenuItems({ setSidebarOpen }) {
  return (
    <div className="menu-items-container">
      {menuItemsData.map((item, index) => (
        <NavLink 
          key={index} 
          to={item.to} 
          end={item.to === '/'} 
          onClick={() => setSidebarOpen(false)} 
          className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}
        >
          <div className="menu-item-content">
            <item.Icon className="menu-icon" />
            <span className="menu-label">{item.label}</span>
          </div>
        </NavLink>
      ))}
    </div>
  )
}

export default MenuItems