const Order = require("../models/Order");
const Cart = require("../models/Cart");

const orderController = {};

orderController.createOrder = async (req, res) => {
  try {
    const { shipInfo, cardValue } = req.body;
    const userId = req.userId;

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty.");
    }

    const orderNum = "ORD" + Date.now();
    const totalPrice = cart.items.reduce(
      (sum, item) => sum + item.productId.price * item.qty, 0
    );

    const order = new Order({
      userId,
      shipTo: { address: shipInfo.address, city: shipInfo.city, zip: shipInfo.zip },
      contact: { firstName: shipInfo.firstName, lastName: shipInfo.lastName, contact: shipInfo.contact },
      totalPrice,
      orderNum,
      items: cart.items.map((item) => ({
        productId: item.productId._id,
        price: item.productId.price,
        qty: item.qty,
        size: item.size,
      })),
    });

    await order.save();
    cart.items = [];
    await cart.save();

        // order 저장 후 stock 차감 추가
    await order.save();

    // 각 아이템 재고 차감
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.productId._id, {
        $inc: { [`stock.${item.size}`]: -item.qty }
      });
    }

cart.items = [];
await cart.save();

    res.status(200).json({ status: "success", orderNum });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

orderController.getOrderList = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await Order.find({ userId }).populate("items.productId");
    res.status(200).json({ status: "success", orders });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = orderController;