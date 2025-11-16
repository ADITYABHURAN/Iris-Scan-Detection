/**
 * AUTHENTICATION CONTROLLER
 * Location: backend/controllers/authController.js
 * 
 * Handles business logic for:
 * - User registration with iris embedding storage
 * - User authentication with cosine similarity comparison
 */

const User = require('../models/User');
const { cosineSimilarity, validateEmbedding } = require('../utils/vectorMath');

/**
 * Register a new user
 * POST /api/register
 * Body: { username, irisEmbedding }
 */
exports.register = async (req, res) => {
  try {
    const { username, irisEmbedding } = req.body;

    // Validation
    if (!username || !irisEmbedding) {
      return res.status(400).json({
        success: false,
        message: 'Username and iris embedding are required'
      });
    }

    // Validate embedding format
    const embeddingValidation = validateEmbedding(irisEmbedding);
    if (!embeddingValidation.valid) {
      return res.status(400).json({
        success: false,
        message: embeddingValidation.message
      });
    }

    // Check if user already exists
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Username already exists. Please choose a different username.'
      });
    }

    // Create new user
    const newUser = new User({
      username: username.toLowerCase().trim(),
      irisEmbedding
    });

    await newUser.save();

    console.log(`✅ New user registered: ${username}`);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        username: newUser.username,
        createdAt: newUser.createdAt
      }
    });

  } catch (error) {
    console.error('Registration error:', error);

    if (error.code === 11000) {
      // Duplicate key error
      return res.status(409).json({
        success: false,
        message: 'Username already exists'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

/**
 * Login user by comparing iris embeddings
 * POST /api/login
 * Body: { username, irisEmbedding }
 */
exports.login = async (req, res) => {
  try {
    const { username, irisEmbedding } = req.body;

    // Validation
    if (!username || !irisEmbedding) {
      return res.status(400).json({
        success: false,
        message: 'Username and iris embedding are required'
      });
    }

    // Validate embedding format
    const embeddingValidation = validateEmbedding(irisEmbedding);
    if (!embeddingValidation.valid) {
      return res.status(400).json({
        success: false,
        message: embeddingValidation.message
      });
    }

    // Find user
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please register first.'
      });
    }

    // Calculate cosine similarity between stored and provided embeddings
    const similarity = cosineSimilarity(user.irisEmbedding, irisEmbedding);
    const similarityPercentage = (similarity * 100).toFixed(2);

    console.log(`🔍 Login attempt for ${username}: ${similarityPercentage}% similarity`);

    // Threshold for authentication (adjust based on testing)
    // Typical values: 0.85-0.95 for strict matching
    const SIMILARITY_THRESHOLD = 0.80; // 80% similarity required

    if (similarity >= SIMILARITY_THRESHOLD) {
      // Authentication successful
      await user.updateLastLogin();

      return res.status(200).json({
        success: true,
        message: 'Authentication successful',
        similarity: similarityPercentage,
        user: {
          username: user.username,
          lastLogin: user.lastLogin
        }
      });
    } else {
      // Authentication failed
      return res.status(401).json({
        success: false,
        message: 'Authentication failed. Iris pattern does not match.',
        similarity: similarityPercentage,
        threshold: (SIMILARITY_THRESHOLD * 100).toFixed(2)
      });
    }

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
};
