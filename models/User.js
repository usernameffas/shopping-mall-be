const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken'); // 1. 부품(토큰 제조기)을 먼저 준비합니다.
require('dotenv').config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY; // 2. 비밀 도장을 꺼냅니다.

// 3. 사용자 기록부 양식(Schema) 정의 - 딱 한 번만 깔끔하게!
const userSchema = Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  level: { 
    type: String, 
    default: "customer", 
    enum: ["customer", "admin"] 
  }
}, { timestamps: true });

// 4. 사원에게 '신분증 발급 능력' 부여 (도장 찍기 전에 가르쳐야 함)
userSchema.methods.generateToken = function () {
  // 나의 ID를 넣고 비밀 도장을 찍어 1일짜리 토큰을 만듭니다.
  const token = jwt.sign({ _id: this._id }, JWT_SECRET_KEY, { expiresIn: '1d' });
  return token;
};

// 5. 모든 능력이 갖춰진 설계도로 실제 'User' 도장을 만듭니다 (Model)
const User = mongoose.model("User", userSchema);

module.exports = User;