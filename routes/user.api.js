const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth'); // 👮‍♂️ 문지기 불러오기

// 1. 회원가입 (누구나 가능)
router.post("/", userController.createUser);

// 2. 로그인 (누구나 가능)
router.post("/login", userController.loginWithEmail);

// 3. 내 정보 조회 (📍 문지기가 신분증 검사 후 통과시켜야 함)
router.get("/me", authMiddleware.authenticate, userController.getUser);

router.post("/google", userController.loginWithGoogle);


module.exports = router; 