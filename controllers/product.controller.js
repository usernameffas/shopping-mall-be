const Product = require("../models/Product");

const productController = {};

// 📦 업무 1: 상품을 받아서 창고(DB)에 넣기
productController.createProduct = async (req, res) => {
  try {
    // 1. 손님이 들고 온 서류(body)에서 물건 정보를 꺼냅니다.
    const { sku, name, size, image, category, description, price, stock, status } = req.body;

    // 2. 새 물건 정보를 장부에 적습니다. (인스턴스 생성)
    const product = new Product({
      sku,
      name,
      size,
      image,
      category,
      description,
      price,
      stock,
      status,
    });

    // 3. 실제 창고(MongoDB)에 물건을 집어넣습니다!
    await product.save();

    // 4. 공장장님께 성공 보고를 올립니다.
    res.status(200).json({ status: "success", product });
  } catch (error) {
    // 5. 만약 물건이 불량이거나 기록에 실패하면 비상벨을 울립니다.
    res.status(400).json({ status: "fail", error: error.message });
  }
};

// 상품 목록 조회 + 검색
productController.getProducts = async (req, res) => {
  try {
    const { name } = req.query;
    let query = { isDeleted: false };
    if (name) query.name = { $regex: name, $options: "i" };
    const products = await Product.find(query);
    res.status(200).json({ status: "success", products });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

// 상품 수정
productController.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ status: "success", product });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

productController.getProducts = async (req, res) => {
  try {
    const { name, category } = req.query;
    let query = { isDeleted: false };
    if (name) query.name = { $regex: name, $options: "i" };
    if (category) query.category = { $in: [category] };
    const products = await Product.find(query);
    res.status(200).json({ status: "success", products });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};


// 상품 상세 조회
productController.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json({ status: "success", product });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};  

module.exports = productController;