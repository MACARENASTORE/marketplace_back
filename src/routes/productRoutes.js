const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/products");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
    });

const upload = multer({storage: storage})

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// Solo los usuarios autenticados pueden crear, actualizar o eliminar productos
router.post("/", authMiddleware, upload.single("image"), productController.createProduct);
router.put("/:id", authMiddleware, productController.updateProduct);
router.delete("/:id", authMiddleware, productController.deleteProduct);

module.exports = router;
