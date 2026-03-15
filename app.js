const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const indexRouter = require('./routes/index'); 
app.use('/api', indexRouter);                  

const mongoURI = process.env.MONGODB_URI_PROD;
mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ MongoDB 연결 성공!"))
  .catch((err) => console.log("❌ DB 연결 실패:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 서버가 ${PORT}번 포트에서 힘차게 돌아가는 중!`);});