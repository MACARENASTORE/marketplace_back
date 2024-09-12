const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// Solo los usuarios autenticados pueden crear, actualizar o eliminar productos
router.post("/", authMiddleware, productController.createProduct);
router.put("/:id", authMiddleware, productController.updateProduct);
router.delete("/:id", authMiddleware, productController.deleteProduct);

module.exports = router;
