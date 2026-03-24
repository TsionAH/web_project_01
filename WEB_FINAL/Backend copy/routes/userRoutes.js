// routes/userRoutes.js
const userController = require('../controllers/userController');

module.exports = {
  // Get current user
  async getCurrentUser(req, res) {
    console.log('🛣️ Route: GET /api/users/me called');
    await userController.getCurrentUser(req, res);
  },

  // Get user by ID
  async getUserById(req, res, userId) {
    console.log(`🛣️ Route: GET /api/users/${userId} called`);
    await userController.getUserById(req, res, userId);
  },

  // Update profile
  async updateProfile(req, res) {
    console.log('🛣️ Route: PUT /api/users/profile called');
    await userController.updateProfile(req, res);
  },

  // Update profile picture
  async updateProfilePicture(req, res) {
    console.log('🛣️ Route: PUT /api/users/profile/picture called');
    await userController.updateProfilePicture(req, res);
  },

  // Update cover photo
  async updateCoverPhoto(req, res) {
    console.log('🛣️ Route: PUT /api/users/profile/cover called');
    await userController.updateCoverPhoto(req, res);
  },

  // Change password
  async changePassword(req, res) {
    console.log('🛣️ Route: PUT /api/users/password called');
    await userController.changePassword(req, res);
  },

  // Get user posts
  async getUserPosts(req, res, userId) {
    console.log(`🛣️ Route: GET /api/users/${userId}/posts called`);
    await userController.getUserPosts(req, res, userId);
  },

  // Toggle follow
  async toggleFollow(req, res, userId) {
    console.log(`🛣️ Route: POST /api/users/${userId}/follow called`);
    await userController.toggleFollow(req, res, userId);
  }
};