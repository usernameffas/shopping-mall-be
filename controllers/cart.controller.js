const Cart = require("../models/Cart");

const cartController = {};

// 1. 카트에 상품 추가
cartController.addItemToCart = async (req, res) => {
  try {
    const { productId, size, qty } = req.body;
    const userId = req.userId;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existItem = cart.items.find(
      (item) => item.productId.toString() === productId && item.size === size
    );

    if (existItem) {
      return res.status(400).json({ status: "fail", error: "이미 장바구니에 있는 상품입니다." });
    }

    cart.items.push({ productId, size, qty });
    await cart.save();

    res.status(200).json({ status: "success", cart });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

// 2. 카트 조회
cartController.getCart = async (req, res) => {
  try {
    const userId = req.userId;
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    res.status(200).json({ status: "success", cart });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

// 3. 카트 아이템 삭제
cartController.deleteCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.userId;

    const cart = await Cart.findOne({ userId });
    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
    await cart.save();

    res.status(200).json({ status: "success", cart });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

// 4. 카트 아이템 수량 변경
cartController.updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { qty } = req.body;
    const userId = req.userId;

    const cart = await Cart.findOne({ userId });
    const item = cart.items.find((item) => item._id.toString() === itemId);
    item.qty = qty;
    await cart.save();

    res.status(200).json({ status: "success", cart });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

// 5. ✅ 드디어 추가된 수량 확인 기능! (이게 있어야 404가 안 납니다)
cartController.getCartQty = async (req, res) => {
  try {
    const userId = req.userId;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(200).json({ status: "success", qty: 0 });
    }
    // 프론트엔드에서 기다리는 'qty'라는 이름으로 데이터를 던집니다.
    res.status(200).json({ status: "success", qty: cart.items.length });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = cartController;