const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const authMiddleware = require("../middlewares/auth");

// 카트 조회
router.get("/", authMiddleware.authenticate, cartController.getCart);

// 카트에 상품 추가
router.post("/", authMiddleware.authenticate, cartController.addItemToCart);

// 카트 아이템 삭제
router.delete("/:itemId", authMiddleware.authenticate, cartController.deleteCartItem);

// 카트 수량 변경
router.put("/:itemId", authMiddleware.authenticate, cartController.updateCartItem);

// routes/cart.api.js

// ... 기존 코드 아래에 추가
// 카트 총 수량 조회 (이 줄이 없어서 404 에러가 났던 겁니다!)
router.get("/qty", authMiddleware.authenticate, cartController.getCartQty); 

module.exports = router;