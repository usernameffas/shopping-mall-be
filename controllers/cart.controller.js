const Cart = require("../models/Cart");

const cartController = {};

// 카트에 상품 추가
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

// 카트 조회
cartController.getCart = async (req, res) => {
  try {
    const userId = req.userId;
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    res.status(200).json({ status: "success", cart });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

// 카트 아이템 삭제
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


module.exports = cartController;