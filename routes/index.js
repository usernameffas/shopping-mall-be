const express = require('express');
const router = express.Router();
const userApi = require('./user.api');
const productApi = require('./product.api');
const cartApi = require('./cart.api');

// "손님, 'user'로 시작하는 요청은 모두 userApi 창구로 가시면 됩니다!"
router.use('/user', userApi);
router.use('/product', productApi);
router.use('/cart', cartApi);

module.exports = router;