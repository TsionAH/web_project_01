import React from 'react'
import { assets } from '../assets/assets'
import { Star } from 'lucide-react'
import { SignIn } from '@clerk/clerk-react'
import './login.css'

function Login() {
  return (
    <div className="homePage">
      <img src={assets.bgImage} alt="Background" />
      
      <div>
        {/* Left Content */}
        <div className="left-content">
          <img src={assets.logo} alt="Logo" className="logo" />
          
          <div className="left-text-container">
            <div className="rating-container">
              <img src={assets.group_users} alt="Group Users" className="group-users" />
              <div>
                <div className="stars-container">
                  {Array(5).fill(0).map((_, i) => (
                    <Star key={i} className="star" />
                  ))}
                </div>
                <p className="rating-text">Used by many Students</p>
              </div>
            </div>
            
            <h1 className="title">The first social media Website for AAU</h1>
            <p className="subtitle">Connect with students using the AAU social</p>
          </div>
        </div>
        
        {/* Right Content - Sign In */}
        <div className="right-content">
          <SignIn />
        </div>
      </div>
    </div>
  )
}

export default Login