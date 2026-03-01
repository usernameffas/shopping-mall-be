const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// [1단계: 공장 보안 및 통역사 배치]
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// [2단계: 📍 이곳이 바로 '안내 데스크' 설치 구역!]
// routes 폴더 안에 있는 index.js 파일을 불러와서 'api'라는 이름의 정문에 연결합니다.
const indexRouter = require('./routes/index'); 
app.use('/api', indexRouter);                  

// [3단계: 지하실 창고(DB) 연결]
const mongoURI = process.env.MONGODB_URI_PROD;
mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ MongoDB 연결 성공!"))
  .catch((err) => console.log("❌ DB 연결 실패:", err));

// [4단계: 공장 전원 올리기]
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 서버가 ${PORT}번 포트에서 힘차게 돌아가는 중!`);
});