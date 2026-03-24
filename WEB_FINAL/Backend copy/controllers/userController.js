// controllers/userController.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper to get user ID from token
function getUserIdFromToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    return decoded.userId;
  } catch (error) {
    console.error('Token verification error:', error.message);
    return null;
  }
}

module.exports = {
  // Get current user profile
  async getCurrentUser(req, res) {
    try {
      console.log('📱 GET /api/users/me - Fetching current user');
      const userId = getUserIdFromToken(req);
      
      if (!userId) {
        console.log('❌ No user ID from token');
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Authentication required' }));
        return;
      }

      console.log(`🔍 Fetching user data for ID: ${userId}`);
      const [users] = await db.query(
        `SELECT id, email, full_name, student_id, department, 
         year_of_study, profile_picture, cover_photo, bio, 
         location, phone, created_at 
         FROM users WHERE id = ?`,
        [userId]
      );

      if (users.length === 0) {
        console.log(`❌ User ${userId} not found`);
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'User not found' }));
        return;
      }

      // Get user stats
      console.log(`📊 Getting stats for user ${userId}`);
      const [postCount] = await db.query(
        'SELECT COUNT(*) as count FROM posts WHERE user_id = ?',
        [userId]
      );

      const [followersCount] = await db.query(
        'SELECT COUNT(*) as count FROM followers WHERE following_id = ?',
        [userId]
      );

      const [followingCount] = await db.query(
        'SELECT COUNT(*) as count FROM followers WHERE follower_id = ?',
        [userId]
      );

      const user = users[0];
      user.posts_count = postCount[0]?.count || 0;
      user.followers_count = followersCount[0]?.count || 0;
      user.following_count = followingCount[0]?.count || 0;

      console.log(`✅ User ${userId} fetched successfully`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        user: user
      }));

    } catch (error) {
      console.error('❌ Error in getCurrentUser:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: 'Failed to fetch user profile',
        details: error.message 
      }));
    }
  },

  // Get user profile by ID
  async getUserById(req, res, userId) {
    try {
      console.log(`📱 GET /api/users/${userId} - Fetching user by ID`);
      const currentUserId = getUserIdFromToken(req);
      
      const [users] = await db.query(
        `SELECT id, email, full_name, student_id, department, year_of_study, 
         profile_picture, cover_photo, bio, location, phone, created_at 
         FROM users WHERE id = ?`,
        [userId]
      );

      if (users.length === 0) {
        console.log(`❌ User ${userId} not found in database`);
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'User not found' }));
        return;
      }

      // Get user stats
      const [postCount] = await db.query(
        'SELECT COUNT(*) as count FROM posts WHERE user_id = ?',
        [userId]
      );

      const [followersCount] = await db.query(
        'SELECT COUNT(*) as count FROM followers WHERE following_id = ?',
        [userId]
      );

      const [followingCount] = await db.query(
        'SELECT COUNT(*) as count FROM followers WHERE follower_id = ?',
        [userId]
      );

      // Check if current user is following this user
      let isFollowing = false;
      if (currentUserId) {
        const [follow] = await db.query(
          'SELECT id FROM followers WHERE follower_id = ? AND following_id = ?',
          [currentUserId, userId]
        );
        isFollowing = follow.length > 0;
      }

      const user = users[0];
      user.posts_count = postCount[0]?.count || 0;
      user.followers_count = followersCount[0]?.count || 0;
      user.following_count = followingCount[0]?.count || 0;
      user.is_following = isFollowing;

      console.log(`✅ User ${userId} fetched`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        user: user
      }));

    } catch (error) {
      console.error(`❌ Error fetching user ${userId}:`, error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: 'Failed to fetch user',
        details: error.message 
      }));
    }
  },

  // Get user's posts
  async getUserPosts(req, res, userId) {
    try {
      console.log(`📱 GET /api/users/${userId}/posts - Fetching user posts`);
      const currentUserId = getUserIdFromToken(req);
      
      // First check if user exists
      const [users] = await db.query('SELECT id FROM users WHERE id = ?', [userId]);
      if (users.length === 0) {
        console.log(`❌ User ${userId} not found`);
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'User not found' }));
        return;
      }

      console.log(`📝 Fetching posts for user ${userId}`);
      const [posts] = await db.query(`
        SELECT p.*, u.full_name, u.student_id, u.profile_picture 
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.id
        WHERE p.user_id = ?
        ORDER BY p.created_at DESC
        LIMIT 20
      `, [userId]);

      console.log(`✅ Found ${posts.length} posts for user ${userId}`);

      // Add like status for current user
      if (currentUserId) {
        for (let post of posts) {
          const [likes] = await db.query(
            'SELECT COUNT(*) as count FROM likes WHERE post_id = ? AND user_id = ?',
            [post.id, currentUserId]
          );
          post.liked = likes[0]?.count > 0;
        }
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        posts: posts
      }));

    } catch (error) {
      console.error(`❌ Error fetching posts for user ${userId}:`, error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: 'Failed to fetch user posts',
        details: error.message 
      }));
    }
  },

  // Update profile (basic info)
  async updateProfile(req, res) {
    try {
      const userId = getUserIdFromToken(req);
      if (!userId) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Authentication required' }));
        return;
      }

      const { full_name, student_id, department, year_of_study, bio, location, phone } = req.body;

      // Update user
      await db.query(
        `UPDATE users 
         SET full_name = ?, student_id = ?, department = ?, 
             year_of_study = ?, bio = ?, location = ?, phone = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [full_name, student_id, department, year_of_study, bio, location, phone, userId]
      );

      // Get updated user
      const [users] = await db.query(
        `SELECT id, email, full_name, student_id, department, year_of_study, 
         profile_picture, cover_photo, bio, location, phone 
         FROM users WHERE id = ?`,
        [userId]
      );

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Profile updated successfully',
        user: users[0]
      }));

    } catch (error) {
      console.error('❌ Error updating profile:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to update profile' }));
    }
  },

  // Toggle follow/unfollow
  async toggleFollow(req, res, targetUserId) {
    try {
      const userId = getUserIdFromToken(req);
      if (!userId) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Authentication required' }));
        return;
      }

      if (userId === parseInt(targetUserId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Cannot follow yourself' }));
        return;
      }

      // Check if already following
      const [existing] = await db.query(
        'SELECT id FROM followers WHERE follower_id = ? AND following_id = ?',
        [userId, targetUserId]
      );

      if (existing.length > 0) {
        // Unfollow
        await db.query(
          'DELETE FROM followers WHERE follower_id = ? AND following_id = ?',
          [userId, targetUserId]
        );

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          following: false,
          message: 'Unfollowed successfully'
        }));
      } else {
        // Follow
        await db.query(
          'INSERT INTO followers (follower_id, following_id) VALUES (?, ?)',
          [userId, targetUserId]
        );

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          following: true,
          message: 'Followed successfully'
        }));
      }

    } catch (error) {
      console.error('❌ Error toggling follow:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to toggle follow' }));
    }
  }
};