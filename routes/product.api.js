const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const authMiddleware = require("../middlewares/auth");

// 📍 상품 등록 (POST /api/product)
// 1차 검문(로그인 확인) -> 2차 검문(관리자 확인) -> 등록 실행
router.post(
  "/",
  authMiddleware.authenticate, // "신분증(Token) 좀 보여주시겠어요?"
  authMiddleware.checkAdmin,   // "관리자 등급이 맞는지 확인하겠습니다."
  productController.createProduct
);

// 📍 상품 전체 조회 (GET /api/product)
// 구경하는 건 누구나 가능하니까 검문소 없이 바로 통과!
router.get("/", productController.getProducts);

module.exports = router;