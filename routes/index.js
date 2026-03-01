const express = require('express');
const router = express.Router();
const userApi = require('./user.api');

// "손님, 'user'로 시작하는 요청은 모두 userApi 창구로 가시면 됩니다!"
router.use('/user', userApi);

module.exports = router;