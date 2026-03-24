const db = require('../config/db');
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
    return null;
  }
}

module.exports = {
  // Get all posts
  async getPosts(req, res) {
    try {
      console.log('📮 Fetching posts...');
      
      // Simple query for now - you can add more complex logic later
      const [posts] = await db.query(`
        SELECT p.*, u.full_name, u.student_id 
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.id
        ORDER BY p.created_at DESC
        LIMIT 20
      `);
      
      // Add like status for current user
      const userId = getUserIdFromToken(req);
      if (userId) {
        for (let post of posts) {
          const [likes] = await db.query(
            'SELECT COUNT(*) as count FROM likes WHERE post_id = ? AND user_id = ?',
            [post.id, userId]
          );
          post.liked = likes[0].count > 0;
        }
      }
      
      console.log(`✅ Found ${posts.length} posts`);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        posts: posts
      }));
      
    } catch (error) {
      console.error('❌ Error fetching posts:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: 'Failed to fetch posts',
        details: error.message 
      }));
    }
  },
  
  // Create new post
  async createPost(req, res) {
    try {
      const userId = getUserIdFromToken(req);
      if (!userId) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Authentication required' }));
        return;
      }
      
      const { content, image_url } = req.body;
      
      if (!content || content.trim().length === 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Post content is required' }));
        return;
      }
      
      console.log(`📝 Creating post for user ${userId}`);
      
      // If image is base64 and too large, truncate for demo (in real app, upload to cloud)
      let processedImageUrl = image_url;
      if (image_url && image_url.startsWith('data:image')) {
        // For demo: store only if less than 100KB, otherwise skip
        if (image_url.length > 100 * 1024) {
          console.log('⚠️ Image too large, storing as null for demo');
          processedImageUrl = null;
        }
      }
      
      const [result] = await db.query(
        'INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)',
        [userId, content.trim(), processedImageUrl || null]
      );
      
      // Get the created post with user info
      const [posts] = await db.query(`
        SELECT p.*, u.full_name, u.student_id 
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.id
        WHERE p.id = ?
      `, [result.insertId]);
      
      console.log(`✅ Post created with ID: ${result.insertId}`);
      
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Post created successfully',
        post: posts[0]
      }));
      
    } catch (error) {
      console.error('❌ Error creating post:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: 'Failed to create post',
        details: error.message 
      }));
    }
  },
  // In your postRoutes.js or postController.js, add:
async deletePost(req, res, postId) {
  try {
    console.log(`🗑️ DELETE /api/posts/${postId} - Deleting post`);
    
    const userId = getUserIdFromToken(req);
    if (!userId) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Authentication required' }));
      return;
    }

    // Check if post exists and belongs to user
    const [posts] = await db.query(
      'SELECT user_id FROM posts WHERE id = ?',
      [postId]
    );

    if (posts.length === 0) {
      console.log(`❌ Post ${postId} not found`);
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Post not found' }));
      return;
    }

    // Check if user owns the post (or is admin)
    if (posts[0].user_id !== userId) {
      console.log(`❌ User ${userId} not authorized to delete post ${postId}`);
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not authorized to delete this post' }));
      return;
    }

    // Delete related likes and comments first (if cascade not set)
    try {
      await db.query('DELETE FROM likes WHERE post_id = ?', [postId]);
      await db.query('DELETE FROM comments WHERE post_id = ?', [postId]);
    } catch (err) {
      console.log('⚠️ Could not delete related data, but continuing:', err.message);
    }

    // Delete the post
    await db.query('DELETE FROM posts WHERE id = ?', [postId]);

    console.log(`✅ Post ${postId} deleted successfully`);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      message: 'Post deleted successfully'
    }));

  } catch (error) {
    console.error('❌ Error deleting post:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      error: 'Failed to delete post',
      details: error.message 
    }));
  }
},
  // Toggle like on post
  async toggleLike(req, res, postId) {
    try {
      const userId = getUserIdFromToken(req);
      if (!userId) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Authentication required' }));
        return;
      }
      
      // Check if already liked
      const [existing] = await db.query(
        'SELECT id FROM likes WHERE post_id = ? AND user_id = ?',
        [postId, userId]
      );
      
      if (existing.length > 0) {
        // Unlike
        await db.query(
          'DELETE FROM likes WHERE post_id = ? AND user_id = ?',
          [postId, userId]
        );
        
        // Update post like count
        await db.query(
          'UPDATE posts SET likes_count = likes_count - 1 WHERE id = ?',
          [postId]
        );
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          liked: false,
          message: 'Post unliked'
        }));
      } else {
        // Like
        await db.query(
          'INSERT INTO likes (post_id, user_id) VALUES (?, ?)',
          [postId, userId]
        );
        
        // Update post like count
        await db.query(
          'UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?',
          [postId]
        );
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          liked: true,
          message: 'Post liked'
        }));
      }
      
    } catch (error) {
      console.error('❌ Error toggling like:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to toggle like' }));
    }
  },
  
  // Add comment to post
  async addComment(req, res, postId) {
    try {
      const userId = getUserIdFromToken(req);
      if (!userId) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Authentication required' }));
        return;
      }
      
      const { comment } = req.body;
      
      if (!comment || comment.trim().length === 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Comment content is required' }));
        return;
      }
      
      // Verify post exists
      const [posts] = await db.query('SELECT id FROM posts WHERE id = ?', [postId]);
      if (posts.length === 0) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Post not found' }));
        return;
      }
      
      // Add comment
      const [result] = await db.query(
        'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
        [postId, userId, comment.trim()]
      );
      
      // Update post comment count
      await db.query(
        'UPDATE posts SET comments_count = comments_count + 1 WHERE id = ?',
        [postId]
      );
      
      // Get the created comment with user info
      const [comments] = await db.query(`
        SELECT c.*, u.full_name 
        FROM comments c
        LEFT JOIN users u ON c.user_id = u.id
        WHERE c.id = ?
      `, [result.insertId]);
      
      console.log(`✅ Comment added to post ${postId}`);
      
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Comment added successfully',
        comment: comments[0]
      }));
      
    } catch (error) {
      console.error('❌ Error adding comment:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to add comment' }));
    }
  }
};