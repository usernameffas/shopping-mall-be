const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authMiddleware = {};

authMiddleware.authenticate = (req, res, next) => {
  try {
    // 1. 손님이 가져온 신분증(Token)을 확인합니다. 
    // 보통 'Authorization'이라는 주머니에 넣어 보냅니다.
    const tokenString = req.headers.authorization;
    if (!tokenString) {
      throw new Error("입장권이 없습니다. 로그인을 먼저 해주세요.");
    }

    // 2. "Bearer eyJhbGci..." 형식에서 실제 토큰 값만 쏙 뽑아냅니다.
    const token = tokenString.replace("Bearer ", "");

    // 3. 비밀 도장으로 이 표가 진짜인지 검사합니다.
    jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
      if (error) {
        throw new Error("유효하지 않은 입장권입니다.");
      }
      
      // 4. 통과! 표 안에 적혀있던 사원 번호(_id)를 다음 실무자에게 전달합니다.
      req.userId = payload._id;
      next(); // "통과! 다음 창구로 가세요."
    });
  } catch (error) {
    res.status(401).json({ status: "fail", error: error.message });
  }
};

authMiddleware.checkAdmin = async (req, res, next) => {
  try {
    const User = require("../models/User");
    const user = await User.findById(req.userId);
    if (!user || user.level !== "admin") {
      throw new Error("관리자만 접근 가능합니다.");
    }
    next();
  } catch (error) {
    res.status(403).json({ status: "fail", error: error.message });
  }
};

module.exports = authMiddleware;