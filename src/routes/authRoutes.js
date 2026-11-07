const express = require('express');
const router = express.Router();
const { login, getMe, register } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { loginRules, validate } = require('../middleware/validator');

router.post('/login', loginRules, validate, login);
router.post('/register', register);
router.get('/me', protect, getMe);

module.exports = router;
