const User = require("../models/User");
const bcrypt = require("bcryptjs");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const userController = {};

// --- [기존 회원가입 업무] ---
userController.createUser = async (req, res) => {
  try {
    let { email, password, name, level } = req.body;
    const salt = await bcrypt.genSaltSync(10);
    password = await bcrypt.hashSync(password, salt);

    const newUser = new User({ email, password, name, level });
    await newUser.save();

    res.status(200).json({ status: "success", data: newUser });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

// 📍 [여기서부터 추가!] --- [신규 로그인 업무] ---
userController.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body; // 손님이 가져온 서류 확인

    // 1. 창고(DB)에서 이메일로 해당 사원을 찾습니다.
    const user = await User.findOne({ email });

    if (user) {
      // 2. 사원이 있다면, 돋보기(bcrypt.compare)로 비밀번호를 대조합니다.
      // 손님이 말한 '123'을 즉석에서 갈아서 창고에 저장된 암호문과 비교합니다.
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        // 📍 [여기입니다!] 사원의 특수 능력을 사용해 신분증(Token)을 생성합니다.
        const token = user.generateToken(); 

        // 손님에게 사원 정보와 함께 '신분증(token)'을 같이 전달합니다.
        return res.status(200).json({ status: "success", user, token });
      }
    }


    // 4. 이메일이 없거나 비번이 틀리면 문을 열어주지 않습니다.
    throw new Error("이메일 또는 비밀번호가 일치하지 않습니다.");

  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

// ... 기존 코드 아래에 추가

userController.getUser = async (req, res) => {
  try {
    // 1. 문지기(authMiddleware)가 "이 사람 번호는 이거야"라고 넘겨준 ID를 받습니다.
    const { userId } = req;

    // 2. 창고(DB)에서 해당 ID를 가진 사원을 찾습니다.
    const user = await User.findById(userId);

    if (user) {
      // 3. 찾았다면 기분 좋게 사원 정보를 돌려줍니다.
      return res.status(200).json({ status: "success", user });
    }

    throw new Error("해당 사용자를 찾을 수 없습니다.");
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

userController.loginWithGoogle = async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, name } = ticket.getPayload();

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, name, password: "google", level: "user" });
      await user.save();
    }
    const token = user.generateToken();
    return res.status(200).json({ status: "success", user, token });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

// module.exports 확인!

// 마지막에 지침서를 외부로 내보냅니다 (서명)
module.exports = userController;