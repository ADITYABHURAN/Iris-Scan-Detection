/**
 * AUTHENTICATION ROUTES
 * Location: backend/routes/authRoutes.js
 * 
 * Defines API endpoints for:
 * - POST /register - Register new user with iris embedding
 * - POST /login - Authenticate user by comparing iris embeddings
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

module.exports = router;
