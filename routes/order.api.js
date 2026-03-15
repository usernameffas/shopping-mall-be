const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/auth');

router.post("/", authMiddleware.authenticate, orderController.createOrder);
router.get("/", authMiddleware.authenticate, orderController.getOrderList);

module.exports = router;